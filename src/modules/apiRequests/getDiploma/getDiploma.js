const { log } = require("../../../services/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateSkills } = require("./generateSkills");
const { generateCertId } = require("../../../utils/generateCertId");
const { createCert } = require("../../../utils/certGenerator");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");
const provideData = require("./provideData");

async function getDiploma({ req, res }) {
	const userId = req?.userId;
	const moduleId = req?.query?.moduleId;

	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
			returns: ["modules", "firstName", "lastName"],
		}),
		getDBRequest("getUserState", {
			query: {
				userId,
				taskId: { $regex: `^${moduleId}` },
			},
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
			returns: ["code", "name", "shortName", "lessons", "totalTasks", "mascot"],
		}),
	];

	try {
		const [userData, stateData, moduleData] = await Promise.all(requests);

		const start = userData?.modules?.[moduleId]?.deadline;
		const deadline = userData?.modules?.[moduleId]?.deadline;
		const now = new Date(Date.now()).toISOString().split("T")[0];
		const certDate = Date.parse(deadline) < Date.parse(now) ? deadline : now;

		const certId =
			userData?.modules?.[moduleId]?.certId ||
			(await generateCertId(userId, moduleId, start));

		const firstName = userData.firstName;
		const lastName = userData.lastName;

		const score = stateData.reduce(
			(progress, value) => progress + (value?.score || 0),
			0
		);

		let maxScore = 0;
		for (const lesson of Object.values(moduleData?.lessons)) {
			for (const task of lesson.tasks) {
				const taskData = await getDBRequest("getTaskInfo", {
					query: {
						id: task,
						type: "practice",
					},
					returns: ["maxScore"],
				});
				maxScore += taskData?.maxScore || 0;
			}
		}

		const doneTasks = stateData.reduce((progress, value) => {
			if (value.isChecked) {
				return progress + 1;
			} else return progress;
		}, 0);

		const progress = Math.trunc((score / maxScore) * 100);

		const skills = await generateSkills(moduleId, userId);

		const params = {
			lang: "ru",
			colored: false,
			mascot: true,
			progress: true,
		};

		const info = {
			moduleId,
			moduleName: moduleData?.name,
			firstName,
			lastName,
			certId,
			certDate,
			progress,
			skills,
		};

		const fullInfo = provideData(info, params);

		const fileId = await createCert(fullInfo);

		moduleData.firstName = firstName;
		moduleData.lastName = lastName;
		moduleData.start = start;
		moduleData.deadline = deadline;
		moduleData.certDate = certDate;
		moduleData.certId = certId;
		moduleData.score = score;
		moduleData.maxScore = maxScore;
		moduleData.skills = skills;
		moduleData.fileId = fileId;

		delete moduleData.lessons;

		moduleData.doneTasks = doneTasks;

		const data = generateMessage(0, moduleData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${moduleId}: Error with processing diploma`);
		log.warn(e);
		const error = generateMessage(20111);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getDiploma",
			data: { moduleId },
			req,
		});
	}
}

module.exports.getDiploma = getDiploma;

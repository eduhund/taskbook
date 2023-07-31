const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateSkills } = require("./generateSkills");
const generateCertId = require("../../../processes/prepareData/prepareCertificateData/generateCertId");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");
const provideData = require("./provideData");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const { fork } = require("child_process");

const cyrillicToTranslit = new CyrillicToTranslit();

async function generateCert(fullInfo) {
	return new Promise((resolve, reject) => {
		const child = fork(__dirname + "/../../../utils/certGenerator");
		child.on("message", (fileId) => {
			log.info("New certificate generated:", fileId);
			child.kill();
			return resolve(fileId);
		});
		child.send(fullInfo);
	});
}

async function getDiploma({ req, res }) {
	const certGen = fork(__dirname + "/../../../utils/certGenerator");

	const userId = req?.userId;
	const { moduleId, lang, isColor, isMascot, isProgress, isPublic } =
		req?.query;

	const params = {
		lang: lang || undefined,
		isColor: isColor ? isColor === "true" : undefined,
		isMascot: isMascot ? isMascot === "true" : undefined,
		isProgress: isProgress ? isProgress === "true" : undefined,
		isPublic: isPublic ? isPublic === "true" : undefined,
	};

	for (const key of Object.keys(params)) {
		if (params[key] === undefined) delete params[key];
	}

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
			returns: [
				"code",
				"name",
				"shortName",
				"lessons",
				"totalTasks",
				"mascot",
				"lang",
			],
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

		const certData = await getDBRequest("getDiploma", {
			query: { id: certId },
			returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
		});

		Object.assign(params, certData?.value || {});
		log.debug(params);

		if (params.lang === undefined) params.lang = moduleData.lang;
		if (params.isColor === undefined) params.isColor = false;
		if (params.isMascot === undefined) params.isMascot = true;
		if (params.isProgress === undefined) params.isProgress = true;
		if (params.isPublic === undefined) params.isPublic = false;

		getDBRequest("setDiploma", {
			query: { id: certId },
			data: params,
			returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
		});

		const firstName =
			params.lang === "ru"
				? userData.firstName
				: cyrillicToTranslit.transform(userData.firstName);
		const lastName =
			params.lang === "ru"
				? userData.lastName
				: cyrillicToTranslit.transform(userData.lastName);

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

		const skills = await generateSkills(
			moduleId,
			userId,
			params.lang || moduleData.lang
		);

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

		const fileId = await generateCert(fullInfo);

		Object.assign(moduleData, params);

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

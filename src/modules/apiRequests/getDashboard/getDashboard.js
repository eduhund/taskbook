const { log } = require("../../../services/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

const { calculateTotalScore } = require("../../../utils/calculators");
const { getNextTaskId } = require("../../../utils/getNextTaskId");
const { setLessonsState } = require("./setLessonsState");
const { getNumberOfDoneTasks } = require("./getNumberOfDoneTasks");
const { generateMessage } = require("../../../utils/messageGenerator");
const { addUserAction } = require("../../../modules/statistics/addUserAction");

const DEMO = process.env.DEMO;

async function getDashboard({ req, res }) {
	const userId = req?.userId;

	const requests = [
		getDBRequest("getModulesList", {
			query: DEMO ? {} : { active: true },
		}),
	];

	try {
		const userData = await getDBRequest("getUserInfo", {
			query: { id: userId },
		});

		const username = `${userData?.firstName} ${userData?.lastName}`;
		const email = userData?.email;
		const lang = userData?.lang;
		const userModules = userData?.modules;

		let modulesList = await getDBRequest("getModulesList", {
			query: {
				...(DEMO ? {} : { active: true }),
				lang,
			},
		});

		modulesList.forEach((module) => {
			module.status = "available";

			delete module.intro;
			delete module.final;
		});

		const availableModules = [];

		for (const moduleId of Object.keys(userModules)) {
			const moduleData = modulesList.find((item) => item.code == moduleId);
			if (!moduleData) continue;
			const today = Date.now();
			const startDate = Date.parse(userModules[moduleId].start);
			const deadline = Date.parse(userModules[moduleId].deadline);
			const UTCMidnight = new Date(deadline);
			UTCMidnight.setUTCHours(23, 59, 59, 0);
			const UTCDeadline = Date.parse(UTCMidnight);

			moduleData.startDate = userModules[moduleId].start;
			moduleData.deadline = userModules[moduleId].deadline;

			if (moduleData.prevModule) {
				if (Object.keys(userModules).includes(moduleData.prevModule)) {
					module.status = "unavailable";
				}
			}

			if (today < startDate) {
				moduleData.status = "paid";
			} else if (today >= UTCDeadline) {
				moduleData.status = "past";
			} else if (today >= UTCDeadline - 864000000 && today < UTCDeadline) {
				moduleData.status = "deadline";
			} else {
				moduleData.status = "active";
			}

			if (
				moduleData.status == "active" ||
				moduleData.status == "deadline" ||
				moduleData.status == "past"
			) {
				const moduleState = await getDBRequest("getUserState", {
					query: {
						userId,
						taskId: { $regex: `^${moduleId}` },
					},
				});

				const nextTaskId = getNextTaskId(moduleData, moduleState);

				moduleData.doneTasks = getNumberOfDoneTasks(moduleState);

				moduleData.lessons = setLessonsState(moduleData.lessons, nextTaskId);

				moduleData.totalScore = calculateTotalScore(moduleState);

				moduleData.nextTask = await getDBRequest("getTaskInfo", {
					query: { id: nextTaskId },
				}).then((result) => {
					let nextTask;
					if (result) {
						nextTask = {
							id: nextTaskId,
							type: result?.type,
							name: result?.name,
							lesson: result?.lesson,
						};
					}
					return nextTask;
				});

				moduleData.moduleId = moduleId;

				availableModules.push(moduleData);

				modulesList = modulesList.filter((module) => module.code !== moduleId);
			}
		}

		availableModules.push(...modulesList);

		const finalData = {
			username,
			email,
			lang,
			modules: availableModules,
		};
		const data = generateMessage(0, finalData);

		res.status(200).send(data);

		return data;
	} catch (e) {
		log.warn(`${userId}: Error with processing dashboard page`);
		log.warn(e);
		const error = generateMessage(20107);
		res.status(400).send(error);
	} finally {
		addUserAction({
			userId,
			action: "getDashboard",
			data: { userId },
			req,
		});
	}
}

module.exports.getDashboard = getDashboard;

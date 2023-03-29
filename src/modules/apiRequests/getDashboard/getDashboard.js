const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

const { calculateTotalScore } = require("../../../utils/calculators");
const { getNextTaskId } = require("../../../utils/getNextTaskId");
const { setLessonsState } = require("./setLessonsState");
const { getNumberOfDoneTasks } = require("./getNumberOfDoneTasks");

async function getDashboard({ userId }) {
	const requests = [
		getDBRequest("getUserInfo", {
			query: { id: userId },
		}),
		getDBRequest("getModulesList", {
			query: process.env.DEMO ? {} : { active: true },
		}),
	];

	let [userData, modulesList] = await Promise.all(requests);

	const username = `${userData?.firstName} ${userData?.lastName}`;
	const email = userData?.email;
	const userModules = userData?.modules;

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
						name:
							result?.type === "practice" ? `Задача ${result?.name}` : "Теория",
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

	return {
		username,
		email,
		modules: availableModules,
	};
}

module.exports.getDashboard = getDashboard;

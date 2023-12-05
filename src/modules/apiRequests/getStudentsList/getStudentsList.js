const { log } = require("../../../services/logger/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { calculateTotalScore } = require("../../../utils/calculators");
const { getNextTaskId } = require("../../../utils/getNextTaskId");
const { getDeadline } = require("../../../utils/access");

async function getStudentsList({res}) {

	try {
		const usersList = await getDBRequest("getUsersList", {});

		const usersData = [];
	
		for (const user of usersList) {
			const userData = {};
			userData.id = user.id;
			userData.email = user.email;
			userData.firstName = user.firstName;
			userData.lastName = user.lastName;
			userData.lang = user.lang;
			userData.gender = user.gender;
			userData.isActivated = user.pass ? true : false;
	
			const userModules = [];
	
			for (const moduleId of Object.keys(user.modules || {})) {
				const start = user.modules[moduleId].start;
				const deadline = getDeadline(user.modules[moduleId]);
				const prolongations = user.modules[moduleId].prolongations || [];
				const certId = user.modules[moduleId].certId;
	
				const requests = [
					getDBRequest("getModuleInfo", {
						query: { code: moduleId },
					}),
					getDBRequest("getUserState", {
						query: {
							userId: user.id,
							taskId: { $regex: `^${moduleId}` },
						},
					}),
				];
	
				const [moduleData, userState] = await Promise.all(requests);
	
				if (!moduleData || Object.keys(moduleData).length === 0) {
					continue;
				}
	
				const moduleName = moduleData?.shortName;
				const mascot = moduleData?.mascot;
	
				const totalTasks = moduleData?.totalTasks;
	
				const forsakenTasksInfo = userState.filter(
					(task) => task?.inProcess && !task?.isChecked
				);
	
				const forsakenTasks = [];
	
				for (const task of forsakenTasksInfo) {
					const taskData = await getDBRequest("getTaskInfo", {
						query: { id: task?.taskId },
						returns: ["id", "type", "name", "lesson", "title"],
					});
	
					forsakenTasks.push({
						id: task?.id,
						type: taskData?.type,
						name:
							taskData?.type === "practice"
								? `Задача ${taskData?.name}`
								: taskData?.title,
					});
				}
	
				const doneTasks = userState.filter((task) => task?.isChecked).length;
	
				const comments = userState.filter(
					(task) => (task.comments || []).length > 0
				).length;
	
				const protests = userState.filter((task) => task?.protest).length;
	
				const nextTaskId = getNextTaskId(moduleData, userState);
	
				const nextTask = await getDBRequest("getTaskInfo", {
					query: { id: nextTaskId },
					returns: ["id", "type", "name", "lesson", "title"],
				});
	
				if (nextTask) {
					nextTask.name =
						nextTask?.type === "practice"
							? `Задача ${nextTask?.name}`
							: nextTask?.title;
				}
				const totalScore = calculateTotalScore(userState);
	
				const maxScore = Object.keys(moduleData.lessons).reduce(
					(sum, lessonId) => {
						return sum + moduleData.lessons[lessonId].maxScore;
					},
					0
				);
	
				const lessons = [];
	
				/*
				for (const lessonId of Object.keys(moduleData.lessons)) {
					const lessonState = await getDBRequest("getUserState", {
						query: {
							userId: user.id,
							taskId: { $regex: `^${moduleId}${lessonId}` },
						},
					});
					const doneTasks = lessonState.filter((task) => task.isChecked).length;
					const totalScore = calculateTotalScore(lessonState);
					const maxScore = moduleData.lessons[lessonId].maxScore;
	
					lessons.push({
						doneTasks,
						totalScore,
						maxScore,
					});
				}
				*/
	
				userModules.push({
					id: moduleId,
					moduleName,
					mascot,
					start,
					deadline,
					prolongations,
					certId,
					totalTasks,
					forsakenTasks,
					doneTasks,
					comments,
					protests,
					nextTask,
					totalScore,
					maxScore,
					lessons,
				});
			}
	
			userData.modules = userModules;
	
			usersData.push(userData);
		}

		res.status(200).send({
			OK: true,
			data: usersData,
		});
	
		return usersData;
	}  catch (e) {
		log.error("Error with processing get students list");
		log.error(e);
		res.sendStatus(500);
	}

}

module.exports = getStudentsList;

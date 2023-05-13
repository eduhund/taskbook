const { getDBRequest } = require("../../../modules/dbRequests/dbRequests");
const { SKILLS } = require("./skillsDict");

async function getMaxScore(taskId) {
	const data = await getDBRequest("getTaskInfo", {
		query: { id: taskId },
		returns: ["maxScore"],
	});

	return data?.maxScore || 0;
}

async function getScore(userId, taskId) {
	const data = await getDBRequest("getStateInfo", {
		query: {
			userId,
			taskId,
		},
		returns: ["score"],
	});

	return data?.score || 0;
}

async function scoreIterator(userId, tasks = []) {
	let score = 0;
	let maxScore = 0;

	for (taskId of tasks) {
		const taskScore = await getScore(userId, taskId);
		const taskMaxScore = await getMaxScore(taskId);

		score += taskScore;
		maxScore += taskMaxScore;
	}

	return [score, maxScore];
}

async function getOneSkill(userId, skill) {
	const skillData = {
		name: skill.name,
	};

	let score = 0;
	let maxScore = 0;

	if (!skill.subskills) {
		[score, maxScore] = await scoreIterator(userId, skill.tasks);
	} else {
		const subskills = [];
		for (subskill of skill.subskills) {
			const subskillData = {
				name: subskill.name,
				code: subskill.code,
			};

			const [subskillScore, subskillMaxScore] = await scoreIterator(
				userId,
				subskill.tasks
			);

			const progress = Math.trunc((subskillScore / subskillMaxScore) * 100);

			subskillData.progress = progress;

			subskills.push(subskillData);

			score += subskillScore;
			maxScore += subskillMaxScore;
		}

		skillData.subskills = subskills;
	}

	const progress = Math.trunc((score / maxScore) * 100);

	skillData.progress = progress;

	return skillData;
}

async function generateSkills(moduleId, userId, lang) {
	const skills = [];

	for (const skill of SKILLS[lang][moduleId] || []) {
		skills.push(await getOneSkill(userId, skill));
	}

	return skills;
}

module.exports.generateSkills = generateSkills;

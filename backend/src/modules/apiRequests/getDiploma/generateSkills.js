const { getDBRequest } = require("../../dbRequests/dbRequests");
const { SKILLS } = require("./skillsDict");

async function getData(userId, moduleId) {
  return Promise.all([
    getDBRequest("getTasksList", {
      query: {
        id: { $regex: `^${moduleId}` },
      },
    }),
    getDBRequest("getUserState", {
      query: {
        userId,
        taskId: { $regex: `^${moduleId}` },
      },
    }),
  ]);
}

async function scoreIterator(tasks = [], tasksData, stateData) {
  let score = 0;
  let maxScore = 0;

  for (const taskId of tasks) {
    const taskData = tasksData.find((task) => task.id === taskId);
    const taskStateData = stateData.find((state) => state.taskId === taskId);

    score += taskStateData?.score || 0;
    maxScore += taskData?.maxScore || 0;
  }

  return [score, maxScore];
}

async function getOneSkill(userId, skill, tasksData, stateData) {
  const skillData = {
    name: skill.name,
  };

  let score = 0;
  let maxScore = 0;

  if (!skill.subskills) {
    [score, maxScore] = await scoreIterator(skill.tasks, tasksData, stateData);
  } else {
    const subskills = [];
    for (subskill of skill.subskills) {
      const subskillData = {
        name: subskill.name,
        code: subskill.code,
      };

      const [subskillScore, subskillMaxScore] = await scoreIterator(
        subskill.tasks,
        tasksData,
        stateData
      );

      const progress = Math.trunc((subskillScore / subskillMaxScore) * 100);

      subskillData.progress = progress;

      subskills.push(subskillData);

      score += subskillScore;
      maxScore += subskillMaxScore;
    }

    skillData.subskills = subskills;
  }

  const progress = Math.trunc((score > maxScore ? 1 : score / maxScore) * 100);

  skillData.progress = progress;

  return skillData;
}

async function generateSkills(moduleId, userId, lang) {
  const [tasksData, stateData] = await getData(userId, moduleId);

  const skills = [];

  for (const skill of SKILLS[lang][moduleId] || []) {
    skills.push(await getOneSkill(userId, skill, tasksData, stateData));
  }

  return skills;
}

module.exports.generateSkills = generateSkills;

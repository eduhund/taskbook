const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateSkills } = require("./generateSkills");
const { generateCertId } = require("../../../utils/generateCertId");
const { createCert } = require("../../../utils/certGenerator");

async function getCertInfo({ userId, moduleId }) {
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
  const [userData, stateData, moduleData] = await Promise.all(requests);

  moduleData.firstName = userData.firstName;
  moduleData.lastName = userData.lastName;

  moduleData.start = userData?.modules?.[moduleId]?.start;
  moduleData.deadline = userData?.modules?.[moduleId]?.deadline;
  moduleData.certId =
    userData?.modules?.[moduleId]?.certId ||
    (await generateCertId(userId, moduleId, moduleData.start));

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

  moduleData.maxScore = maxScore;

  delete moduleData.lessons;

  moduleData.score = stateData.reduce(
    (progress, value) => progress + (value?.score || 0),
    0
  );

  moduleData.doneTasks = stateData.reduce((progress, value) => {
    if (value.isChecked) {
      return progress + 1;
    } else return progress;
  }, 0);

  moduleData.skills = await generateSkills(moduleId, userId);

  moduleData.fileId = createCert(moduleId, {}, []);

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getCertInfo = getCertInfo;

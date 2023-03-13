const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateSkills } = require("./generateSkills");
const { generateCertId } = require("../../../utils/generateCertId");
const { createCert } = require("../../../utils/certGenerator");

function setCertType(progress = 0) {
  if (progress >= 80) {
    return "сертификат с отличием";
  } else if (progress >= 60) {
    return "сертификат";
  } else return "зачетку";
}

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

  const deadline = userData?.modules?.[moduleId]?.deadline;
  const now = new Date(Date.now()).toISOString().split("T")[0];
  const certDate = Date.parse(deadline) < Date.parse(now) ? deadline : now;

  const certId =
    userData?.modules?.[moduleId]?.certId ||
    (await generateCertId(userId, moduleId, moduleData.start));

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

  const certType = setCertType(progress);

  const params = {
    lang: "ru",
    colored: false,
    mascot: true,
    progress: true,
  };

  const info = {
    code: moduleId,
    firstName,
    lastName,
    certType,
    certId,
    certDate,
    progress,
    multilineCourseName: moduleData?.name,
  };

  const fileId = createCert(moduleId, params, [info, skills]);

  moduleData.firstName = firstName;
  moduleData.lastName = lastName;
  moduleData.deadline = deadline;
  moduleData.certDate = certDate;
  moduleData.certId = certId;
  moduleData.score = score;
  moduleData.maxScore = maxScore;
  moduleData.skills = skills;
  moduleData.fileId = fileId;

  delete moduleData.lessons;

  moduleData.doneTasks = doneTasks;

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getCertInfo = getCertInfo;

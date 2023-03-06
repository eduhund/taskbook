const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");

const { getModuleId, getLessonId } = require("../../../utils/idExtractor");
const { createSummary } = require("./createSummary");

async function getLessonFinal({ userId, fullLessonId }) {
  const moduleId = getModuleId(fullLessonId);
  const lessonId = getLessonId(fullLessonId);

  const requests = [
    getDBRequest("getUserInfo", {
      query: { id: userId },
      returns: ["modules"],
    }),
    getDBRequest("getUserState", {
      query: {
        userId,
        taskId: { $regex: `^${moduleId}${lessonId}` },
      },
    }),
    getDBRequest("getModuleInfo", {
      query: { code: moduleId },
      returns: ["shortName", "lessons", "maxScore", "totalTasks"],
    }),
  ];
  const [userData, stateData, moduleData] = await Promise.all(requests);

  moduleData.lessonNumber = Number(lessonId);
  moduleData.maxScore = moduleData.lessons[lessonId]?.maxScore;
  moduleData.content = moduleData.lessons[lessonId]?.final;

  let totalPractice = 0;
  for (const task of moduleData.lessons[lessonId]?.tasks) {
    await getDBRequest("getTaskInfo", {
      query: { id: task },
      returns: ["type"],
    }).then((result) => {
      if (result?.type == "practice") totalPractice++;
    });
  }

  moduleData.deadline = userData?.modules?.[moduleId]?.deadline;

  moduleData.score = stateData.reduce(
    (progress, value) => progress + (value?.score || 0),
    0
  );

  moduleData.summary = createSummary(moduleData?.score, moduleData?.maxScore);

  moduleData.doneTasks = stateData.reduce((progress, value) => {
    if (value.isChecked) {
      return progress + 1;
    } else return progress;
  }, 0);

  delete moduleData.lessons;

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getLessonFinal = getLessonFinal;

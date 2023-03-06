const { log } = require("../../../utils/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getModuleId, getLessonId } = require("../../../utils/idExtractor");

async function getLessonStart({ userId, fullLessonId }) {
  const moduleId = getModuleId(fullLessonId);
  const lessonId = getLessonId(fullLessonId);

  const requests = [
    getDBRequest("getUserInfo", {
      query: { id: userId },
      returns: ["modules"],
    }),
    getDBRequest("getModuleInfo", {
      query: { code: moduleId },
      returns: ["name", "shortName", "lessons", "totalTasks"],
    }),
  ];

  const [userData, moduleData] = await Promise.all(requests);

  moduleData.lessonNumber = Number(lessonId);
  moduleData.lessonName = moduleData.lessons[lessonId]?.title;
  moduleData.description = moduleData.lessons[lessonId]?.description;
  moduleData.intro = moduleData.lessons[lessonId]?.intro;
  moduleData.deadline = userData?.modules?.[moduleId]?.deadline;

  delete moduleData.lessons;

  return {
    OK: true,
    data: moduleData,
  };
}

module.exports.getLessonStart = getLessonStart;

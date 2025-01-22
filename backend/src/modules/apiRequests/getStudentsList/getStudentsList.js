const { log } = require("../../../services/logger/logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getDeadline } = require("../../../utils/access");
const { generateMessage } = require("../../../utils/messageGenerator");

async function getStudentsList(req, res) {
  const usersList = await getDBRequest("getUsersList", {});
  const modulesList = await getDBRequest("getModulesList", {});

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
      const moduleData = modulesList.find((m) => m.code === moduleId);
      const moduleState = user.modules[moduleId];

      const deadline = getDeadline(user.modules[moduleId]);

      const moduleName = moduleData?.shortName;
      const mascot = moduleData?.mascot;
      const totalTasks = moduleData?.totalTasks;
      const maxScore = Object.values(moduleData?.lessons || {}).reduce(
        (acc, lesson) => {
          return acc + lesson.maxScore || 0;
        },
        0
      );

      userModules.push({
        ...moduleState,
        totalTasks,
        maxScore,
        id: moduleId,
        moduleName,
        mascot,
        deadline,
      });
    }

    userData.modules = userModules;

    usersData.push(userData);
  }

  const data = generateMessage(0, usersData);
  res.status(200).send(data);

  return;
}

module.exports = getStudentsList;

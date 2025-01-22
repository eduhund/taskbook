require("dotenv").config();
require("module-alias/register");

const { log } = require("@logger");
const server = require("@express/express");
const { dbConnect } = require("@mongo/mongo");
const { getDBRequest } = require("./src/modules/dbRequests/dbRequests");
const { calculateTotalScore } = require("@utils/calculators");

async function start() {
  try {
    await dbConnect();
    await server.start();
    log.info("All systems running. Let's rock!");
  } catch ({ message, trace }) {
    log.error("Hewston, we have a problem!");
    log.debug(message);
    log.trace(trace);
    process.exit();
  }
}

start();

async function updateModulesState() {
  try {
    const usersList = await getDBRequest("getUsersList", {});

    const filteredUsersList = usersList.filter((user) => user?.id > "U0000000");

    for (const user of filteredUsersList) {
      log.info("Updating user:", user.id);
      for (const moduleId of Object.keys(user.modules || {})) {
        const userState = await getDBRequest("getUserState", {
          query: {
            userId: user.id,
            taskId: { $regex: `^${moduleId}` },
          },
        });

        const forsakenTasksInfo = userState.filter(
          (task) => task?.inProcess && !task?.isChecked
        );

        const forsakenTasks = forsakenTasksInfo.map((task) => task?.taskId);

        const doneTasks = userState.filter((task) => task?.isChecked).length;

        const comments = userState.filter(
          (task) => (task.comments || []).length > 0
        ).length;

        const totalScore = calculateTotalScore(userState);

        const protests = userState.filter((task) => task?.protest).length;
        const updatedData = {
          [`modules.${moduleId}.doneTasks`]: doneTasks,
          [`modules.${moduleId}.forsakenTasks`]: forsakenTasks.length,
          [`modules.${moduleId}.totalScore`]: totalScore,
          [`modules.${moduleId}.totalProtests`]: protests,
          [`modules.${moduleId}.totalComments`]: comments,
        };

        await getDBRequest("setUserInfo", { id: user.id, data: updatedData });
      }
    }
    log.info("Done!");
  } catch ({ message, trace }) {
    log.error(message);
    log.trace(trace);
    process.exit();
  }
}

updateModulesState();

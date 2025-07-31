const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");

function validator(
  newModule,
  modules = {},
  prevModule = null,
  purchaseType = "new"
) {
  switch (purchaseType) {
    case "new":
      if (modules[newModule]) {
        return { status: false, error: "Module already purchased" };
      }

      if (modules[prevModule]) {
        return { status: false, error: "Previous module isn't purchased" };
      }

      return { status: true };

    case "renewal":
      if (!modules[newModule]) {
        return { status: false, error: "Module isn't purchased" };
      }

      const now = Date.now();
      const deadline = new Date(modules[newModule].deadline).getTime();

      if (now > deadline + 1000 * 60 * 60 * 24 * 14) {
        return { status: false, error: "Module access is expired" };
      }

      return { status: true };

    case "upgrade":
      if (!modules[newModule]) {
        return { status: false, error: "Module isn't purchased" };
      }

      if (modules[prevModule].accessType == "full") {
        return { status: false, error: "Module is already bought" };
      }
      if (modules[prevModule].accessType == "timely") {
        const now = Date.now();
        const deadline = new Date(modules[prevModule].deadline).getTime();

        if (now > deadline + 1000 * 60 * 60 * 24 * 1) {
          return { status: false, error: "Module access is expired" };
        }
      }
      return { status: true };
    case "refresh":
      if (!modules[newModule]) {
        return { status: false, error: "Module isn't purchased" };
      }

      return { status: true };
    case "test":
      return { status: true };
    default:
      return { status: false, error: "Invalid purchase type" };
  }
}

async function checkModuleAvailability(req, res, next) {
  try {
    const { email, moduleId, purchaseType } = req.data;

    if (!email || !moduleId) {
      next({ code: 10002 });
      return false;
    }

    const requests = [
      getDBRequest("getUserInfo", {
        query: { email },
        returns: ["modules"],
      }),
      getDBRequest("getModuleInfo", {
        query: { code: moduleId },
        returns: ["prevModule"],
      }),
    ];

    const [userData, moduleData] = await Promise.all(requests);

    const result = validator(
      moduleId,
      userData.modules,
      moduleData.prevModule,
      purchaseType
    );

    next({ content: result });

    return;
  } catch (err) {
    next({ code: 20200 });
  }
}

module.exports = checkModuleAvailability;

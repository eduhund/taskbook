const { log } = require("@logger");

const { getDBRequest } = require("../../dbRequests/dbRequests");
const { getDeadline } = require("../../../utils/access");

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
      const renewalDeadline = new Date(getDeadline(modules[newModule])).getTime();

      if (Number.isNaN(renewalDeadline)) {
        return { status: false, error: "Module deadline is invalid" };
      }

      if (now > renewalDeadline + 1000 * 60 * 60 * 24 * 14) {
        return { status: false, error: "Module access is expired" };
      }

      return { status: true };

    case "upgrade":
      if (!modules[newModule]) {
        return { status: false, error: "Module isn't purchased" };
      }

      if (modules[newModule].accessType == "full") {
        return { status: false, error: "Module is already bought" };
      }
      if (modules[newModule].accessType == "timely") {
        const now = Date.now();
        const upgradeDeadline = new Date(getDeadline(modules[newModule])).getTime();

        if (Number.isNaN(upgradeDeadline)) {
          return { status: false, error: "Module deadline is invalid" };
        }

        if (now > upgradeDeadline + 1000 * 60 * 60 * 24 * 1) {
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

const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { setKey } = require("../../../services/tokenMachine/OTK");
const { lowerString } = require("../../../utils/stringProcessor");
const { hashPass } = require("../../../utils/pass");
const { sendMail } = require("../../../services/mailer");
const { normalizeISODate } = require("../../../utils/date");

function createModules(modules) {
  const modulesObject = {};
  modules.forEach(({ id, start, deadline }) => {
    const startDate = normalizeISODate(start);
    const deadlineDate = normalizeISODate(deadline);
    if (!startDate || !deadlineDate) {
      throw new Error(`Invalid module dates for ${id}`);
    }
    modulesObject[id] = { start: startDate, deadline: deadlineDate };
  });
  return modulesObject;
}

async function createUser({ body = {} }, res, next) {
  try {
    const {
      email,
      pass,
      firstName,
      lastName,
      modules,
      lang,
      settings = { sendEmail: false },
    } = body;

    if (!(email && (firstName || lastName))) {
      next({ code: 10002 });
      return;
    }

    const userEmail = lowerString(email);

    const isUserExist = await getDBRequest("checkUsername", {
      email: userEmail,
    });

    if (isUserExist) {
      next({ code: 20102 });
      return;
    }

    let modulesData = {};
    try {
      modulesData = createModules(modules);
    } catch {
      next({ code: 10002 });
      return;
    }

    const newUser = {
      email: userEmail,
      pass: pass ? hashPass(pass) : "",
      firstName,
      lastName,
      modules: modulesData,
      lang,
    };

    const createdUser = await getDBRequest("addUser", newUser);

    const otk = await setKey(createdUser.id, "oneTimeKey");

    if (!createdUser.pass) {
      newUser.key = otk;
    }

    if (settings.sendEmail && modules.length > 0) {
      const moduleInfo = await getDBRequest("getModuleInfo", {
        query: { code: modules[0].id },
      });

      const link = `${process.env.FRONTEND_URL}/createPassword?email=${userEmail}&verifyKey=${otk}&lang=${lang}`;

      const date = normalizeISODate(Date.now());
      const start = normalizeISODate(modules[0].start);
      if (!date || !start) {
        next({ code: 10002 });
        return;
      }
      const params = {
        template_id: date < start ? "p2vv6r2j" : "f53503qv",
        address: userEmail,
        lang,
      };

      const data = {
        NAME: newUser?.firstName || "",
        MODULE: moduleInfo?.name || "",
        MODULELINK: moduleInfo?.moduleLink || "",
        MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
        MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
        START_DATE: new Date(Date.parse(start)).toLocaleDateString("ru-RU", {
          month: "long",
          day: "numeric",
        }),
        PASSWORD: pass || "",
        PASSWORD_LINK: link,
      };

      await sendMail(params, data);
    }

    next({ content: newUser });

    log.info(`New user was created:`, createdUser);

    return;
  } catch (e) {
    log.error(e);
    next({ code: 20214 });
    return;
  }
}

module.exports = createUser;

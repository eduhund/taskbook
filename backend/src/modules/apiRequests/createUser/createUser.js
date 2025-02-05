const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { setKey } = require("../../../services/tokenMachine/OTK");
const { lowerString } = require("../../../utils/stringProcessor");
const { hashPass } = require("../../../utils/pass");
const { sendMail } = require("../../../services/mailer");

function optimiseDate(date) {
  const initialDate = new Date(date);
  return initialDate.toISOString().split("T")[0];
}

function createModules(modules) {
  const modulesObject = {};
  modules.forEach(({ id, start, deadline }) => {
    const startDate = optimiseDate(start);
    const deadlineDate = optimiseDate(deadline);
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

    const newUser = {
      email: userEmail,
      pass: pass ? hashPass(pass) : "",
      firstName,
      lastName,
      modules: createModules(modules),
      lang,
    };

    const createdUser = await getDBRequest("addUser", newUser);

    if (!createdUser.pass) {
      newUser.key = await setKey(createdUser.id, "oneTimeKey");
    }

    if (settings.sendEmail && modules.length > 0) {
      const moduleInfo = await getDBRequest("getModuleInfo", {
        query: { code: modules[0].id },
      });

      const link = `${process.env.FRONTEND_URL}/createPassword?email=${payment.email}&verifyKey=${secureKey}&lang=${lang}`;

      const date = optimiseDate(Date.now());
      const start = optimiseDate(modules[0].start);
      const params = {
        template_id: date < start ? "p2vv6r2j" : "f53503qv",
        address: payment.email,
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
        PASSWORD: createdUser.pass || "",
        PASSWORD_LINK: link,
      };

      sendMail(params, data);
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

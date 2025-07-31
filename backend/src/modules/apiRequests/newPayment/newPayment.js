const { getDBRequest } = require("../../dbRequests/dbRequests");
const { calculateDeadline } = require("../../../utils/calculators");
const { hashPass } = require("../../../utils/pass");
const { setKey } = require("../../../services/tokenMachine/OTK");
const { sendMail } = require("../../../services/mailer");
const { log } = require("@logger");

function getDateObject(date) {
  const timestamp = date ? Date.parse(date) : Date.mow();
  return new Date(timestamp);
}

function getISODateOny(date) {
  const dateObject = typeof date === "string" ? getDateObject(date) : date;
  return dateObject.toISOString().split("T")[0];
}

function getAccessType(amount, currency) {
  switch (currency) {
    case "RUB":
      if (amount === 1000) {
        return "timely";
      } else return null;
    case "USD":
      if (amount === 0) {
        return "partly";
      } else return "full";
    default:
      return "full";
  }
}

async function newPayment(req, res) {
  try {
    const { body } = req;

    const {
      email,
      firstName,
      lastName,
      startDate,
      moduleId,
      isProlongation,
      isUpgrade,
      transactionId,
      amount,
      currency,
    } = body;

    const now = new Date();

    const moduleInfo = await getDBRequest("getModuleInfo", {
      query: { code: moduleId.toUpperCase() },
    });

    if (!moduleInfo) {
      res.status(400);
      res.send({
        OK: false,
        error: "invalid_params",
      });
      return;
    }

    const user = await getDBRequest("getUserInfo", {
      query: { email: email },
    });

    const accessType = getAccessType(amount, currency);

    let deadline = calculateDeadline(
      startDate,
      accessType === "timely" ? 1 : 62
    );

    const lang = moduleId === "HSE" || moduleId === "HSP" ? "en" : "ru";

    if (!user) {
      const userPass = Math.random().toString(36).substring(2);

      const newUser = {
        email: email,
        pass: userPass ? hashPass(userPass) : "",
        firstName: firstName,
        lastName: lastName,
        modules: {
          [moduleId]: {
            start: startDate,
            deadline,
            prolongations: [],
            accessType: accessType,
          },
        },
        lang,
      };

      const createdUser = await getDBRequest("addUser", newUser);

      const secureKey = await setKey(createdUser?.id, "oneTimeKey");

      const link = `${process.env.FRONTEND_URL}/createPassword?email=${email}&verifyKey=${secureKey}&lang=${lang}`;

      const params = {
        template_id: getISODateOny(now) < startDate ? "rq4lt12h" : "l9ujirgq",
        address: email,
        lang,
      };

      const data = {
        NAME: newUser?.firstName || "",
        MODULE: moduleInfo?.name || "",
        MODULELINK: moduleInfo?.moduleLink || "",
        MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
        MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
        START_DATE: new Date(Date.parse(startDate)).toLocaleDateString(
          "ru-RU",
          {
            month: "long",
            day: "numeric",
          }
        ),
        PASSWORD: userPass || "",
        PASSWORD_LINK: link,
      };

      await sendMail(params, data);
    } else if (isUpgrade) {
      const currentAccessType = user?.modules[moduleId]?.accessType || "full";
      const currentDeadline = user?.modules[moduleId]?.deadline;
      if (currentAccessType === "full") {
        res.status(400);
        res.send({
          OK: false,
          error: "invalid_params",
        });
        return;
      } else if (currentAccessType === "timely") {
        deadline = calculateDeadline(currentDeadline, 61);
        const prolData = {
          type: "upgrade",
          transactionId,
          until: deadline,
        };
        user.modules[moduleId].deadline = deadline;
        user.modules[moduleId].accessType = "full";
        if (!Array.isArray(user.modules[moduleId].prolongations)) {
          user.modules[moduleId].prolongations = [];
        }
        user.modules[moduleId].prolongations.push(prolData);

        await getDBRequest("setUserInfo", {
          id: user?.id,
          data: { modules: user.modules },
        });

        const params = {
          template_id: "c8oikgth",
          address: email,
          lang,
        };

        const data = {
          NAME: user?.firstName || "",
          MODULE: moduleInfo?.name || "",
          MODULELINK: moduleInfo?.moduleLink || "",
          MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
          MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
          START_DATE: new Date(Date.parse(startDate)).toLocaleDateString(
            "ru-RU",
            {
              month: "long",
              day: "numeric",
            }
          ),
        };

        await sendMail(params, data);
      }
    } else if (isProlongation) {
      const now = new Date(Date.now());
      const currentDeadline = new Date(user?.modules[moduleId].deadline);
      const newDeadline = currentDeadline > now ? currentDeadline : now;
      deadline = calculateDeadline(newDeadline, 62);

      const prolData = {
        type: "renewal",
        transactionId,
        until: deadline,
      };

      user.modules[moduleId].deadline = deadline;
      if (!Array.isArray(user.modules[moduleId].prolongations)) {
        user.modules[moduleId].prolongations = [];
      }
      user.modules[moduleId].prolongations.push(prolData);

      await getDBRequest("setUserInfo", {
        id: user?.id,
        data: { modules: user.modules },
      });

      const params = {
        template_id: "c8oikgth",
        address: email,
        lang,
      };

      const data = {
        NAME: user?.firstName || "",
        MODULE: moduleInfo?.name || "",
        MODULELINK: moduleInfo?.moduleLink || "",
        MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
        MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
        START_DATE: new Date(Date.parse(startDate)).toLocaleDateString(
          "ru-RU",
          {
            month: "long",
            day: "numeric",
          }
        ),
      };

      await sendMail(params, data);
    } else {
      const activeModules = Object.entries(user.modules || {}).filter(
        ([, value]) =>
          Date.now() - Date.parse(value.deadline) <= 7 * 24 * 60 * 60 * 1000
      );

      for (const [id] of activeModules) {
        const isCurrent = id === moduleId;
        const type = isCurrent ? "newBuy" : "otherModule";
        const data = {
          type,
          transactionId,
          until: deadline,
        };

        user.modules[id].deadline = deadline;
        if (!Array.isArray(user.modules[id].prolongations)) {
          user.modules[id].prolongations = [];
        }
        user.modules[id].prolongations.push(data);
      }

      if (!user.modules[moduleId]) {
        user.modules[moduleId] = {
          start: startDate,
          deadline,
          prolongations: [
            {
              type: "newBuy",
              transactionId,
              until: deadline,
            },
            accessType,
          ],
        };
      }

      await getDBRequest("setUserInfo", {
        id: user?.id,
        data: { modules: user.modules },
      });

      const params = {
        template_id: getISODateOny(now) < startDate ? "ju2fou81" : "it2mrnd7",
        address: email,
        lang,
      };

      const data = {
        NAME: user?.firstName || "",
        MODULE: moduleInfo?.name || "",
        MODULELINK: moduleInfo?.moduleLink || "",
        MASCOTLETTERTOP: moduleInfo?.mascot?.letterTop || "",
        MASCOTLETTERBOTTOM: moduleInfo?.mascot?.letterBottom || "",
        START_DATE: new Date(Date.parse(startDate)).toLocaleDateString(
          "ru-RU",
          {
            month: "long",
            day: "numeric",
          }
        ),
      };

      await sendMail(params, data);
    }

    res.sendStatus(200);
    return;
  } catch (e) {
    log.error("Error in new payment processing!");
    log.debug(e);
    res.sendStatus(500);
  }
}

module.exports = newPayment;

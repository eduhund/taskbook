const { log } = require("@logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { generateSkills } = require("./generateSkills");
const generateCertId = require("../../../utils/generateCertId");
const { generateMessage } = require("../../../utils/messageGenerator");
const provideData = require("./provideData");
const CyrillicToTranslit = require("cyrillic-to-translit-js");
const { fork } = require("child_process");

const cyrillicToTranslit = new CyrillicToTranslit();

async function generateCert(fullInfo) {
  return new Promise((resolve, reject) => {
    const child = fork(__dirname + "/../../../utils/certGenerator");
    child.on("message", (fileId) => {
      log.info("New certificate generated:", fileId);
      child.kill();
      return resolve(fileId);
    });
    child.send(fullInfo);
  });
}

async function getDiploma(req, res) {
  const userId = req?.userId;
  const { moduleId, lang, isColor, isMascot, isProgress, isPublic } =
    req?.query;

  const params = {
    lang: lang || "ru", //undefined,
    isColor: isColor ? isColor === "true" : false, //undefined,
    isMascot:
      isColor === undefined
        ? isMascot
          ? isMascot === "true"
          : true //undefined
        : !(isColor === "true"),
    isProgress: isProgress ? isProgress === "true" : true, //undefined,
    isPublic: isPublic ? isPublic === "true" : false, //undefined,
  };

  for (const key of Object.keys(params)) {
    if (params[key] === undefined) delete params[key];
  }

  const requests = [
    getDBRequest("getUserInfo", {
      query: { id: userId },
      returns: ["modules", "firstName", "lastName"],
    }),
    getDBRequest("getModuleInfo", {
      query: { code: moduleId },
      returns: [
        "code",
        "name",
        "shortName",
        "lessons",
        "totalTasks",
        "mascot",
        "lang",
      ],
    }),
  ];

  try {
    const [userData, moduleData] = await Promise.all(requests);

    const start = userData?.modules?.[moduleId]?.deadline;
    const deadline = userData?.modules?.[moduleId]?.deadline;
    const now = new Date(Date.now()).toISOString().split("T")[0];
    const certDate = Date.parse(deadline) < Date.parse(now) ? deadline : now;

    const certId =
      userData?.modules?.[moduleId]?.certId ||
      (await generateCertId(userId, moduleId, start));

    /*
    const certData = await getDBRequest("getDiploma", {
      query: { id: certId },
      returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
    });

    if (params.lang === undefined)
      params.lang = certData?.lang || moduleData.lang;
    if (params.isColor === undefined)
      params.isColor = certData?.isColor || false;
    if (params.isMascot === undefined)
      params.isMascot =
        certData?.isMascot === undefined ? true : certData?.isMascot;
    if (params.isProgress === undefined)
      params.isProgress =
        certData?.isProgress === undefined ? true : certData?.isProgress;
    if (params.isPublic === undefined)
      params.isPublic = certData?.isPublic || false;

    getDBRequest("setDiploma", {
      query: { id: certId },
      data: params,
      returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
    });
    */

    const firstName =
      params.lang === "ru"
        ? userData.firstName
        : cyrillicToTranslit.transform(userData.firstName);
    const lastName =
      params.lang === "ru"
        ? userData.lastName
        : cyrillicToTranslit.transform(userData.lastName);

    const score = userData?.modules?.[moduleId]?.totalScore || 0;

    let maxScore = 0;
    for (const lesson of Object.values(moduleData?.lessons)) {
      maxScore += lesson?.maxScore || 0;
    }

    const doneTasks = userData?.modules?.[moduleId]?.doneTasks || 0;

    const progress = Math.trunc((score / maxScore) * 100);

    const skills = await generateSkills(
      moduleId,
      userId,
      params.lang || moduleData.lang
    );

    const info = {
      moduleId,
      moduleName: moduleData?.name,
      firstName,
      lastName,
      certId,
      certDate,
      progress,
      skills,
    };

    const fullInfo = provideData(info, params);

    const fileId = await generateCert(fullInfo);

    Object.assign(moduleData, params);

    moduleData.firstName = firstName;
    moduleData.lastName = lastName;
    moduleData.start = start;
    moduleData.deadline = deadline;
    moduleData.certDate = certDate;
    moduleData.certId = certId;
    moduleData.score = score;
    moduleData.maxScore = maxScore;
    moduleData.skills = skills;
    moduleData.fileId = fileId;

    delete moduleData.lessons;

    moduleData.doneTasks = doneTasks;

    const data = generateMessage(0, moduleData);
    res.status(200).send(data);

    log.info(
      `${userId} created a certificate for module ${moduleId}:`,
      fileId,
      params
    );

    return;
  } catch (error) {
    log.error(error);
    res.sendStatus(500);
  }
}

module.exports = getDiploma;

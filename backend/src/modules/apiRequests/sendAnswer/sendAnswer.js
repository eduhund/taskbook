const { log } = require("../../../services/logger/logger");
const { getDBRequest } = require("../../dbRequests/dbRequests");
const { prepareMail } = require("../../../services/mailer/actions");
const { sendMail } = require("../../../services/mailer/actions");

async function sendAnswer(req, res) {
  const { email, content } = req.body

  const moduleId = content.taskId.substr(0, 3)
  const taskLink = `https://my.eduhund.com/${moduleId}/${content.taskId.substr(3, 5)}/${content.taskId.substr(5, 7)}`

  const requests = [
    getDBRequest("getUserInfo", {
			query: { email },
			returns: ["firstName"],
		}),
		getDBRequest("getModuleInfo", {
			query: { code: moduleId },
      returns: ["mascot"]
		}),
		getDBRequest("getTaskInfo", {
			query: { id: content.taskId },
      returns: ["title", "name"]
		}),
	];

	const [userData, moduleData, taskData] = await Promise.all(
		requests
	);

  const params = {
    lang: "ru",
    status: "new",
    type: "comment",
  };

  const data = {
    NAME: userData?.firstName || "",
    MODULENAME: moduleData?.name || "",
    TASKNAME: taskData.title || taskData.name || "", 
    TASKLINK: taskLink,
    MASCOTLETTERTOP: moduleData?.mascot?.letterTop || "",
    MASCOTLETTERBOTTOM: moduleData?.mascot?.letterBottom || "",
    QUESTION: content?.question || "",
    ANSWER: content?.answer || ""
  };

  const mail = prepareMail({ params, data });

  sendMail(mail, email, "eduHund");

  res.sendStatus(200)
}

module.exports = sendAnswer;


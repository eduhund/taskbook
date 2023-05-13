const userData = require("./prepareUserData/prepareUserData");
const moduleData = require("./prepareModuleData/prepareModuleData");
const lessonData = require("./prepareLessonData/prepareLessonData");
const taskData = require("./prepareTaskData/prapareTaskData");
const certificateData = require("./prepareCertificateData/prepareCertificateData");

const prepareData = {
	userData,
	moduleData,
	lessonData,
	taskData,
	certificateData,
};

module.exports = prepareData;

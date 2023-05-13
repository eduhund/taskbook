const prepareUserData = require("./prepareUserData/prepareUserData");
const prepareModuleData = require("./prepareModuleData/prepareModuleData");
const prepareLessonData = require("./prepareLessonData/prepareLessonData");
const prapareTaskData = require("./prepareTaskData/prapareTaskData");
const prepareCertificateData = require("./prepareCertificateData/prepareCertificateData");

const prepareData = {
	prepareUserData,
	prepareModuleData,
	prepareLessonData,
	prapareTaskData,
	prepareCertificateData,
};

module.exports = prepareData;

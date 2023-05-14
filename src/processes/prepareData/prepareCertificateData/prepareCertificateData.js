const setDiploma = require("../../setDiploma/setDiploma");
const generateSkills = require("./generateSkills");
const generateCertId = require("./generateCertId");
const createCert = require("./certGenerator");
const provideData = require("./provideData");
const CyrillicToTranslit = require("cyrillic-to-translit-js");

async function prepareCertificateData(data) {
	const cyrillicToTranslit = new CyrillicToTranslit();
	const {
		userId,
		moduleId,
		params: { lang, isColor, isMascot, isProgress, isPublic } = {},
		user,
		module,
		state,
	} = data;

	const params = {
		lang: lang || undefined,
		isColor: isColor ? isColor === "true" : undefined,
		isMascot: isMascot ? isMascot === "true" : undefined,
		isProgress: isProgress ? isProgress === "true" : undefined,
		isPublic: isPublic ? isPublic === "true" : undefined,
	};

	for (const key of Object.keys(params)) {
		if (params[key] === undefined) delete params[key];
	}

	const start = user?.modules?.[moduleId]?.deadline;
	const deadline = user?.modules?.[moduleId]?.deadline;
	const now = new Date(Date.now()).toISOString().split("T")[0];
	const certDate = Date.parse(deadline) < Date.parse(now) ? deadline : now;

	const certId =
		user?.modules?.[moduleId]?.certId ||
		(await generateCertId(userId, moduleId, start));

	const certData = await setDiploma({
		query: { id: certId },
		params,
		returns: ["lang", "isColor", "isMascot", "isProgress", "isPublic"],
	});

	Object.assign(params, certData?.value || {});

	if (params.lang === undefined) params.lang = module.lang;
	if (params.isColor === undefined) params.isColor = false;
	if (params.isMascot === undefined) params.isMascot = true;
	if (params.isProgress === undefined) params.isProgress = true;
	if (params.isPublic === undefined) params.isPublic = false;

	const firstName =
		params.lang === "ru"
			? user.firstName
			: cyrillicToTranslit.transform(user.firstName);
	const lastName =
		params.lang === "ru"
			? user.lastName
			: cyrillicToTranslit.transform(user.lastName);

	const score = state.reduce(
		(progress, value) => progress + (value?.score || 0),
		0
	);

	const maxScore = Object.values(module?.lessons).reduce((sum, lesson) => {
		return (sum += lesson.maxScore || 0);
	}, 0);

	const doneTasks = state.reduce((progress, value) => {
		if (value.isChecked) {
			return ++progress;
		} else return progress;
	}, 0);

	const progress = Math.trunc((score / maxScore) * 100);

	const skills = await generateSkills(
		moduleId,
		userId,
		params.lang || module.lang
	);

	const info = {
		moduleId,
		moduleName: module?.name,
		firstName,
		lastName,
		certId,
		certDate,
		progress,
		skills,
	};

	const fullInfo = provideData(info, params);

	const fileId = await createCert(fullInfo);

	return {
		moduleId,
		moduleName: module.name,
		userId,
		firstName,
		lastName,
		start,
		deadline,
		certDate,
		certId,
		score,
		maxScore,
		skills,
		fileId,
		doneTasks,
		...params,
	};
}

module.exports = prepareCertificateData;

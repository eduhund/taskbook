import { logOut, back } from "../helpers/helpers";

const URL = process.env.REACT_APP_SERVER;
const token = localStorage.getItem("accessToken") || "";
const defaultLang = process.env.REACT_APP_DEFAULT_LANG;

async function auth(request: any) {
	const response = await fetch(`${URL}/auth`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});
	return response.json();
}

async function checkPayment(request: any) {
	const response = await fetch(`${URL}/checkPayment`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});
	return response.json();
}

function createPassword(request: any) {
	const data = fetch(`${URL}/createPassword`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	}).then((response) => {
		return response.json();
	});

	return data;
}

function getModuleNav(moduleId: string) {
	const data = fetch(
		`${URL}/getLessonsList?moduleId=${moduleId.toUpperCase()}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		return response.json();
	});

	return data;
}

function getLessonNav(lessonId: string) {
	console.log(lessonId)
	debugger
	const data = fetch(
		`${URL}/getTasksList?lessonId=${lessonId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		return response.json();
	});

	return data;
}

function getModuleStart(moduleId: string | undefined) {
	if (!moduleId) {
		return undefined;
	}
	const data = fetch(
		`${URL}/getModuleStart?moduleId=${moduleId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function getModuleFinal(moduleId: string) {
	const data = fetch(
		`${URL}/getModuleFinal?moduleId=${moduleId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function getModuleInfo(moduleId: string) {
	const data = fetch(
		`${URL}/getModuleInfo?moduleId=${moduleId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		return response.json();
	});

	return data;
}

function getLessonStart(lessonId: string) {
	const data = fetch(
		`${URL}/getLessonStart?&lessonId=${lessonId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function getLessonFinal(lessonId: string) {
	const data = fetch(
		`${URL}/getLessonFinal?&lessonId=${lessonId}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function getDiploma(moduleId: string, params: any) {
	const urlParams = new URLSearchParams({
		moduleId,
		...params,
		accessToken: token,
	});

	const data = fetch(`${URL}/getDiploma?` + urlParams, {
		method: "GET",
	}).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

async function getDashboard() {
	const response = await fetch(`${URL}/getDashboard?accessToken=${token}`, {
		method: "GET",
	});
	if (response?.status === 401) logOut();
	return response.json();
}

function getTask(taskId: string) {
	const data = fetch(`${URL}/getTask?taskId=${taskId}&accessToken=${token}`, {
		method: "GET",
	}).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function setState(questionId: string, state: Object) {
	console.log(state);
	const data = fetch(`${URL}/setState`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			questionId,
			state,
			accessToken: token,
		}),
	}).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function setControls(taskId: string, controlsState: Object) {
	const data = fetch(`${URL}/setControls`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			taskId,
			controlsState,
			accessToken: token,
		}),
	}).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function checkTask(taskId: string, status: boolean, protest: boolean) {
	const postData = {
		accessToken: token,
		taskId,
		isChecked: status,
		protest: protest,
	};
	const data = fetch(`${URL}/checkTask`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	}).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function addComment(taskId: string, comment: string, protest: boolean) {
	const data = fetch(`${URL}/addComment`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ taskId, comment, protest, accessToken: token }),
	}).then((response) => {
		console.log("Add comment response:", response);
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

function getCounselor(lang: string | undefined) {
	const data = fetch(
		`${URL}/getCounselor?lang=${lang || defaultLang}&accessToken=${token}`,
		{
			method: "GET",
		}
	).then((response) => {
		if (response?.status === 401) logOut();
		if (response?.status === 403) back();
		return response.json();
	});

	return data;
}

export {
	auth,
	checkPayment,
	getModuleNav,
	getLessonNav,
	getModuleInfo,
	getModuleStart,
	getLessonStart,
	getLessonFinal,
	getModuleFinal,
	getDiploma,
	getDashboard,
	getTask,
	setState,
	checkTask,
	addComment,
	createPassword,
	setControls,
	getCounselor,
};

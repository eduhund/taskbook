function logOut() {
	localStorage.removeItem("accessToken");
	document.location.href = "/login";
}

function go(path: string) {
	document.location.href = path;
}

function back() {
	document.location.href = "/";
}

export { logOut, go, back };

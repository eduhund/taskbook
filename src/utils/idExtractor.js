function getModuleId(id = "") {
	try {
		return id.substring(0, 3);
	} catch {
		throw new Error("Can't extract module ID from", id);
	}
}

function getLessonId(id = "") {
	try {
		return id.substring(3, 5);
	} catch {
		throw new Error("Can't extract lesson ID from", id);
	}
}

function getFullLessonId(id = "") {
	try {
		return id.substring(0, 5);
	} catch {
		throw new Error("Can't extract full lesson ID from", id);
	}
}

function getTaskId(id = "") {
	try {
		return id.substring(5, 7);
	} catch {
		throw new Error("Can't extract task ID from", id);
	}
}

function getFullTaskId(id = "") {
	try {
		return id.substring(0, 7);
	} catch {
		throw new Error("Can't extract full task ID from", id);
	}
}

function getContentId(id = "") {
	try {
		return id.substring(7, 9);
	} catch {
		throw new Error("Can't extract content ID from", id);
	}
}

function getFullContentId(id = "") {
	try {
		return id.substring(0, 9);
	} catch {
		throw new Error("Can't extract full content ID from", id);
	}
}

function getQuestionId(id = "") {
	try {
		return id.substring(9, 11);
	} catch {
		throw new Error("Can't extract question ID from", id);
	}
}

function getFullQuestionId(id = "") {
	try {
		return id.substring(0, 11);
	} catch {
		throw new Error("Can't extract full question ID from", id);
	}
}

function getElementId(id = "") {
	try {
		return id.substring(11, 13);
	} catch {
		throw new Error("Can't extract element ID from", id);
	}
}

function getFullElementId(id = "") {
	try {
		return id.substring(0, 13);
	} catch {
		throw new Error("Can't extract full element ID from", id);
	}
}

module.exports = {
	getModuleId,
	getLessonId,
	getFullLessonId,
	getTaskId,
	getFullTaskId,
	getContentId,
	getFullContentId,
	getQuestionId,
	getFullQuestionId,
	getElementId,
	getFullElementId,
};

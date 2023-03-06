function getModuleId(id = "") {
  try {
    return id.substring(0, 3);
  } catch {
    return undefined;
  }
}

function getLessonId(id = "") {
  try {
    return id.substring(3, 5);
  } catch {
    return undefined;
  }
}

function getFullLessonId(id = "") {
  try {
    return id.substring(0, 5);
  } catch {
    return undefined;
  }
}

function getTaskId(id = "") {
  try {
    return id.substring(5, 7);
  } catch {
    return undefined;
  }
}

function getFullTaskId(id = "") {
  try {
    return id.substring(0, 7);
  } catch {
    return undefined;
  }
}

function getContentId(id = "") {
  try {
    return id.substring(7, 9);
  } catch {
    return undefined;
  }
}

function getFullContentId(id = "") {
  try {
    return id.substring(0, 9);
  } catch {
    return undefined;
  }
}

function getQuestionId(id = "") {
  try {
    return id.substring(9, 11);
  } catch {
    return undefined;
  }
}

function getFullQuestionId(id = "") {
  try {
    return id.substring(0, 11);
  } catch {
    return undefined;
  }
}

function getElementId(id = "") {
  try {
    return id.substring(11, 13);
  } catch {
    return undefined;
  }
}

function getFullElementId(id = "") {
  try {
    return id.substring(0, 13);
  } catch {
    return undefined;
  }
}

module.exports.getModuleId = getModuleId;
module.exports.getLessonId = getLessonId;
module.exports.getFullLessonId = getFullLessonId;
module.exports.getTaskId = getTaskId;
module.exports.getFullTaskId = getFullTaskId;
module.exports.getContentId = getContentId;
module.exports.getFullContentId = getFullContentId;
module.exports.getQuestionId = getQuestionId;
module.exports.getFullQuestionId = getFullQuestionId;
module.exports.getElementId = getElementId;
module.exports.getFullElementId = getFullElementId;

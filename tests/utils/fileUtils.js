const fs = require("fs");
const path = require("path");

function readFileAsString(fileName) {
  const file = path.join(__dirname, "../", fileName);
  return fs.readFileSync(file, "utf8", function(err, data) {
    return data;
  });
}

function readFileAsObject(fileName) {
  return JSON.parse(readFileAsString(fileName));
}

module.exports.readFileAsString = readFileAsString;
module.exports.readFileAsObject = readFileAsObject;
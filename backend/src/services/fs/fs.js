const { log } = require("../logger/logger");
const fs = require("fs")
const path = require('path');

const projectPath = process.cwd()

function createPath(filePath) {
  fs.mkdirSync(filePath, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

function readFile(filePath, name) {
  const fullPath = path.join(projectPath, filePath)

  try {
    return JSON.parse(fs.readFileSync(fullPath + name))
  } catch {
    return
  }
}

function writeFile(filePath, name, data) {
  const fullPath = path.join(projectPath, filePath)
  if (!fs.existsSync(fullPath)) {
    createPath(fullPath)
  }
  
  try {
    fs.writeFileSync(fullPath + name, JSON.stringify(data))
  } catch {
    throw new Error("Dump file is not wroted")
  }
}

module.exports = {readFile, writeFile}
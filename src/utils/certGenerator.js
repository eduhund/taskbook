const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");
const path = require("node:path");

const mainColors = {
  MIO: "#FAC43B",
  TXT: "#A6200E",
  HSB: "#0C356C",
  COM: "#6B70E2",
  UCC: "#295A12",
};

/**
 * @param {string} str
 * @returns {string}
 */
function hyphenate(str) {
  if (str == "Hard Skills начинающего руководителя") {
    return "Hard Skills начинающего \nруководителя";
  }

  if (str == "Информационные ожидания") {
    return "Информационные \nожидания";
  }

  if (str == "Несекретные секреты текстов") {
    return "Несекретные \nсекреты текстов";
  }

  if (str == "Сценарии взаимодействия") {
    return "Сценарии \nвзаимодействия";
  }

  if (str == "Композиция в дизайне интерфейсов") {
    return "Композиция \nв дизайне интерфейсов";
  }

  return str;
}

/**
 * @param {string} svg
 * @param {Map} values
 * @returns {string}
 */
function processDisciplines(svg, values) {
  var bracket = "<!--performance-->";
  var disciplines = values;
  var prefixIndex = svg.indexOf(bracket);
  var suffixIndex = svg.indexOf(bracket, prefixIndex + bracket.length);
  if (prefixIndex >= 0 && suffixIndex >= 0) {
    suffixIndex += bracket.length;
    var template = svg
      .slice(prefixIndex + bracket.length, suffixIndex - bracket.length)
      .trim();
    var content = [];
    for (const skill of disciplines) {
      var line = template
        .replace("{key}", skill.name)
        .replace("{value}", skill.progress);
      content.push(line);
    }
    content = content.join("\n");
    svg = svg.slice(0, prefixIndex) + content + svg.slice(suffixIndex);
  }
  return svg;
}

/**
 * @param {string} svg
 * @param {Map} values
 * @returns {string}
 */
function processValues(svg, values) {
  const prefix = "{{";
  const suffix = "}}";
  var len = svg.length;
  if (len == 0) {
    return;
  }
  for (const [identifier, elementValue] of values) {
    const multiline = identifier.startsWith("multiline");
    if (!multiline) {
      svg = svg.replaceAll(prefix + identifier + suffix, elementValue);
    } else {
      var identifierIndex = svg.length;
      while (identifierIndex >= 0) {
        identifierIndex = svg.lastIndexOf(identifier);
        if (identifierIndex < 0) break;
        var openTagIndex = svg.lastIndexOf("<", identifierIndex);
        var closeTagIndex = svg.indexOf(">", identifierIndex);
        if (openTagIndex < 0 || closeTagIndex < 0) break;
        var tag = svg.slice(openTagIndex, closeTagIndex + 1);
        var elementValueTrim = hyphenate(elementValue, 8).split("\n");
        var content =
          elementValueTrim == null
            ? []
            : elementValueTrim.map((v) =>
                tag.replace(prefix + identifier + suffix, v)
              );
        content = content.join("");
        svg = svg.replace(tag, content);
      }
    }
  }
  return svg;
}

/**
 * @param {string} svg
 */
function buildSvg(svg, [values, disciplines]) {
  var valuesMap = new Map(Object.entries(values));
  var date = new Date(valuesMap.get("certDate") || "2022-09-01")
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");
  valuesMap.set("certDate", date);
  svg = processDisciplines(svg, disciplines);
  svg = processValues(svg, valuesMap);
  return svg;
}

async function createCert(module, params, data) {
  const [info, disciplines] = data;
  var svg = fs.readFileSync(`./templates/diplomas/poster.svg`).toString();
  info.bgColor = params.colored ? mainColors[module] || "#101010" : "#FFFFFF";
  info.primaryColor =
    params.colored && module !== "MIO" ? "#FFFFFF" : mainColors[module];
  info.textColor = module === "MIO" || !params.colored ? "#101010" : "#FFFFFF";
  info.headerOpacity = info?.progress < 60 ? "0.1" : "1";

  if (params.colored && module !== "MIO") {
    info.skillOpacity = "0.77";
  } else if (params.colored && module === "MIO") {
    info.skillOpacity = "0.6";
  } else if (!params.progress) {
    info.skillOpacity = "0";
  } else info.skillOpacity = "1";

  if (params.mascot && !params.colored && info?.progress >= 60) {
    info.mascotOpacity = "1";
  } else if (params.mascot && !params.colored && info?.progress < 60) {
    info.mascotOpacity = "0.3";
  } else info.mascotOpacity = "0";

  if (params.progress && info?.progress >= 60) {
    info.progressOpacity = "1";
  } else if (params.progress && info?.progress < 60) {
    info.progressOpacity = "0.3";
  } else info.progressOpacity = "0";

  info.signColor = params.colored || module !== "MIO" ? "w" : "b";

  console.log(info);

  const processed = buildSvg(svg, [info, disciplines]);
  const fileId = crypto
    .createHash("sha256")
    .update(data[0]?.certId)
    .digest("hex");

  const buffer = Buffer.from(processed);
  const folderPath = path.resolve(`./diplomas/${fileId}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(`./diplomas/${fileId}`, { recursive: true });
  }
  await sharp(buffer, { density: 150 })
    .png()
    .toFile(folderPath + `/medium.png`);
  return fileId;
}

module.exports.createCert = createCert;

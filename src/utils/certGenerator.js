const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");

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
    console.log(identifier, elementValue);
    if (!multiline) {
      svg = svg.replace(prefix + identifier + suffix, elementValue);
    } else {
      var identifierIndex = svg.length;
      while (identifierIndex >= 0) {
        identifierIndex = svg.lastIndexOf(identifier);
        if (identifierIndex < 0) break;
        var openTagIndex = svg.lastIndexOf("<", identifierIndex);
        var closeTagIndex = svg.indexOf(">", identifierIndex);
        if (openTagIndex < 0 || closeTagIndex < 0) break;
        var tag = svg.slice(openTagIndex, closeTagIndex + 1);
        console.log(tag);
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
  var date = (valuesMap.get("date") || "2022-09-01").split("-");
  date.reverse();
  date = date.join(".");
  valuesMap.set("date", date);
  svg = processDisciplines(svg, disciplines);
  svg = processValues(svg, valuesMap);
  return svg;
}

function createCert(module, params, data) {
  const info = {
    header: "#0071B2",
    headerOpacity: "1",
    background: "#ffffff",
    foreground: "#002033",
    foreground2: "#0071B2",
    date: "2022-12-31",
    certType: "зачетку",
    certId: `MIO00000000`,
    firstName: "Роман",
    lastName: "Небыль",
    totalScore: 100,
    multilineCourseName: "Информационные ожидания",
    code: "MIO",
  };
  //const [info, disciplines] = data;
  var svg = fs.readFileSync(`./templates/diplomas/${module}.svg`).toString();
  const processed = buildSvg(svg, [info, []]);
  const fileId = crypto
    .createHash("sha256")
    .update(`MIO00000000`)
    .digest("hex");
  sharp(Buffer.from(processed)).png().toFile(`./diplomas/${fileId}.png`);
  return fileId;
}

module.exports.createCert = createCert;

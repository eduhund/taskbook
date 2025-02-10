const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");
const path = require("node:path");
const { buildSvg } = require("svg-content");

async function createCert(data, quality = "medium") {
  const svg = fs.readFileSync(`./templates/diplomas/poster.svg`).toString();
  const processed = buildSvg(svg, data);
  console.log(data);
  fs.writeFileSync(`./templates/diplomas/poster2.svg`, processed);
  const fileId = crypto.createHash("sha256").update(data.certId).digest("hex");

  const buffer = Buffer.from(processed);
  const folderPath = path.resolve(`./diplomas/${fileId}`);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(`./diplomas/${fileId}`, { recursive: true });
  }
  const settings = {
    small: {
      dpi: 72,
      fileName: "small",
    },
    medium: {
      dpi: 150,
      fileName: "medium",
    },
    large: {
      dpi: 300,
      fileName: "large",
    },
  };

  const { dpi, fileName } = settings[quality];
  await sharp(buffer, { density: dpi })
    .png()
    .toFile(`${folderPath}/${fileName}.png`);
  return fileId;
}

process.on("message", async (msg) => {
  console.log(msg);
  const cert = await createCert(msg);
  process.send(cert);
  console.log("finish");
});

module.exports = createCert;

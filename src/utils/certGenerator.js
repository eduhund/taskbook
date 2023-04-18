const sharp = require("sharp");
const crypto = require("crypto");
const fs = require("fs");
const path = require("node:path");
const { buildSvg } = require("svg-content");

async function createCert(data) {
	const svg = fs.readFileSync(`./templates/diplomas/poster.svg`).toString();
	const processed = buildSvg(svg, data);
	const fileId = crypto.createHash("sha256").update(data.certId).digest("hex");

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

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

async function generatePDF({ module, certId, fileId, withSkills }: any) {
	const URL = process.env.REACT_APP_LINK;
	var doc = new jsPDF("p", "pt", "a4");
	doc.addImage(
		`${URL}/diplomas/${fileId}/medium.png`,
		"PNG",
		0,
		0,
		595,
		842,
		undefined,
		"FAST"
	);

	if (module === "MIO" && withSkills) {
		const skills: any = document.getElementById("skills");
		const skillCanvas = await html2canvas(skills, { scale: 4 });
		const skillsImg = skillCanvas.toDataURL("image/svg");
		var sWidth: number = skillCanvas.width;
		var sHeight: number = skillCanvas.height;
		var sHratio = sHeight / sWidth;
		var pWidth = doc.internal.pageSize.width;
		var pHeight = pWidth * sHratio;
		doc.addPage([pWidth, pHeight], "p");
		doc.addImage(
			skillsImg,
			"svg",
			20,
			20,
			pWidth - 40,
			pHeight - 40,
			undefined,
			"FAST"
		);
	}

	doc.save(`${certId}.pdf`);
	return true;
}

export { generatePDF };

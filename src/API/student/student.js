const STUDENT = [
	{
		name: "auth",
		type: "post",
		params: ["email", "pass"],
		exec: [(req, res) => console.log("pow")],
	},
];

module.exports = { STUDENT };

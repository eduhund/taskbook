function validate(res, ...args) {
	var valid = true;
	for (var i = 0; i < args.length; i++) {
		valid = valid && Boolean(args[i]);
	}
	if (!valid) {
		res.send({
			OK: false,
			error: {
				code: 10101,
				type: "invalid_request",
				description: "Missing required params",
			},
		});
	}
	return valid;
}

module.exports.validate = validate;

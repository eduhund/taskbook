function validate(res, ...args) {
  var valid = true;
  for (var i = 0; i < args.length; i++) {
    valid = valid && Boolean(args[i]);
  }

  if (!valid) {
    res.send({
      OK: false,
      error: "invalid_credentials",
      error_description: "Missing arguments",
      error_code: 10004,
    });
  }
  return valid;
}

module.exports.validate = validate;

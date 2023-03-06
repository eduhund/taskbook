const fetch = require("node-fetch");

const server = process.env.REG_OTK_SERVER;

async function checkKey(key) {
  const response = await fetch(`${server}/check_otk?key=${key}`);
  const data = await response.json();
  return data || false;
}

async function setKey(user) {
  const response = await fetch(`${server}/set_otk`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  return data || undefined;
}

module.exports.checkKey = checkKey;
module.exports.setKey = setKey;

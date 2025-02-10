const fetch = require("node-fetch");

const { OTK_SERVER, OTK_TOKEN } = process.env;

const bearerToken = "Bearer " + OTK_TOKEN;

function getKeyParams(type) {
  switch (type) {
    case "oneTimePass":
      return {
        type: "digit",
        length: 4,
        life: 3600,
        isReusable: false,
      };
    case "oneTimeKey":
      return {
        type: "string",
        length: 8,
        life: 62 * 24 * 60 * 60,
        isReusable: false,
      };
    default:
      return {
        type: "digit",
        length: 4,
        life: 3600,
        isReusable: false,
      };
  }
}

async function checkKey(key) {
  try {
    const response = await fetch(`${OTK_SERVER}/checkKey?key=${key}`, {
      headers: {
        Authorization: bearerToken,
      },
    });
    const { OK, error } = await response.json();
    console.log(error);
    return OK;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function setKey(userId, type) {
  const body = {
    userId,
    ...getKeyParams(type),
  };
  const response = await fetch(`${OTK_SERVER}/setKey`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      Authorization: bearerToken,
    },
  });
  const data = await response.json();
  return data?.data?.key || undefined;
}

module.exports = { checkKey, setKey };

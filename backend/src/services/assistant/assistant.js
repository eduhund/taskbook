const fetch = require("node-fetch");
const { log } = require("@logger");

const { ASSISTANT_WEBHOOR_URL, ASSISTANT_ADMIN_TOKEN } = process.env;

async function sendMessage(body) {
  try {
    const url = ASSISTANT_WEBHOOR_URL + "/sendMessage"
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { 
        "Content-Type": "application/json",
        "Authorization": ASSISTANT_ADMIN_TOKEN
       },
    })
  } catch (e) {
    log.error("sendMessage assistant webhook failed")
    log.debug(e)
  }
}

module.exports = { sendMessage }
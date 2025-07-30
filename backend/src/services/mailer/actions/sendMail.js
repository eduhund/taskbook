const { MAIL_API } = process.env;

async function sendMailToUser(params, data) {
  try {
    const { template_id, address, lang = "ru" } = params;
    return fetch(`${MAIL_API}/send_mail_to_user`, {
      method: "POST",
      body: JSON.stringify({
        template_id,
        address,
        lang,
        data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw new Error("Error while sending mail");
  }
}

module.exports = sendMailToUser;

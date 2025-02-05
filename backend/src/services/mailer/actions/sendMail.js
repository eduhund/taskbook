const { MAIL_API } = process.env;

async function sendMailToUser(params, data) {
  try {
    const { template_id, address, lang = "ru" } = params;
    return fetch(`${MAIL_API}/sendMail`, {
      method: "POST",
      body: {
        template_id,
        address,
        lang,
        data,
      },
    });
  } catch (error) {
    throw new Error("Error while sending mail");
  }
}

module.exports = sendMailToUser;

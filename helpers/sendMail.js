exports.sendMail = async (email, username, url, cancelUrl) => {
  try {
    const mail = await fetch(process.env.SCRIPTS_MAILER, {
      redirect: "follow",
      method: "POST",
      contentType: "text/plain",
      cors: "no-cors",
      body: JSON.stringify({
        email,
        username,
        url,
        cancelUrl,
      }),
    });

    if (mail.status !== 200) {
      throw new Error("Error sending mail");
    }

    return;
  } catch (error) {
    console.log(error);
    throw new Error("Error sending mail");
  }
};

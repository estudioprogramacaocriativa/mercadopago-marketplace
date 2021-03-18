"use strict";

const Mail = use("Mail");
const Env = use("Env");
const Helpers = use("Helpers");
const CustomHelpers = use("App/Helpers");
const appName = process.env.APP_NAME;

class NotificationsEmail {
  static async sendNotification(
    template,
    subject,
    emailTo,
    obj = {},
    attach = false
  ) {
    const attachObj = {
      copyYear: new Date().getFullYear(),
      helpers: CustomHelpers,
      dotEnv: Env,
      title: subject,
      appName,
    };

    const mergeObj = {
      ...attachObj,
      ...obj,
    };

    await Mail.send(template, mergeObj, (message) => {
      message.embed(Helpers.publicPath("images/logo.png"), "logo");
      message.embed(Helpers.publicPath("images/favicon.png"), "favicon");
      message.to(emailTo);
      message.from(Env.get("MAIL_USERNAME"));
      message.subject(subject);
    });
  }
}

module.exports = NotificationsEmail;

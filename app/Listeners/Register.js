/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const User = (exports = module.exports = {});
const Helpers = use("App/Helpers");
const Notifications = use("App/Notifications/Email");
const ResourceNotify = use("App/Models/ApplicationNotification");
const ResourceEmail = use("App/Models/ApplicationEmail");
const ResourceConfig = use("App/Models/ApplicationConfiguration");

User.store = async (user, showPassword) => {
  let urlSystem = process.env.APP_WEB_URL;

  const userType = user.role === "client" ? "site" : "admin";
  if (userType === "admin") urlSystem = process.env.APP_WEB_ADM_URL;

  const appName = process.env.APP_NAME;
  const userToken = user.first_access_hash;

  await Notifications.sendNotification(
    "emails.registration",
    `Seja bem-vindo(a) à ${process.env.APP_NAME}`,
    user.email,
    {
      user,
      showPassword,
      appName,
      userToken,
      urlSystem,
    }
  );
};

User.notify = async (user) => {
  const notify = await ResourceNotify.first();

  let compareField;
  let compareFieldId;

  switch (user.role) {
    case "reseler":
      compareField = "notify_when_new_reseler";
      compareFieldId = "reseler_email_id";
      break;
    case "master":
      compareField = "notify_when_new_admin";
      compareFieldId = "admin_email_id";
      break;
    case "client":
      compareField = "notify_when_new_client";
      compareFieldId = "client_email_id";
      break;
    default:
      compareField = "notify_when_new_client";
      compareFieldId = "client_email_id";
      break;
  }

  if (notify !== null && notify[compareField]) {
    const notifyMail = await ResourceEmail.find(notify[compareFieldId]);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();
      const role = await Helpers.convertRole(user.role);

      await Notifications.sendNotification(
        "emails.adm-notifications.new-user",
        `Foi realizado o cadastro de um novo usuário no site`,
        notifyMail.email,
        {
          user,
          baseUrl,
          config,
          role,
        }
      );
    }
  }
};

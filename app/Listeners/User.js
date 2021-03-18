/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const User = (exports = module.exports = {});
const Notifications = use("App/Notifications/Email");

User.notifyReseler = async (user) => {
  const urlSystem = process.env.APP_WEB_URL;
  const appName = process.env.APP_NAME;
  const userToken = user.first_access_hash;

  await Notifications.sendNotification(
    "emails.reseler-account-activated",
    `Sua conta foi ativada na ${process.env.APP_NAME}`,
    user.email,
    {
      user,
      appName,
      userToken,
      urlSystem,
    }
  );
};

User.notifyBlockedAccount = async (user) => {
  const urlSystem = process.env.APP_WEB_URL;
  const appName = process.env.APP_NAME;
  const userToken = user.first_access_hash;

  await Notifications.sendNotification(
    "emails.user-account-blocked",
    `Sua conta foi bloqueada na ${process.env.APP_NAME}`,
    user.email,
    {
      user,
      appName,
      userToken,
      urlSystem,
    }
  );
};

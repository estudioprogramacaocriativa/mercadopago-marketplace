/* eslint-disable prettier/prettier */
/* eslint-disable no-multi-assign */

"use strict";

const Notifications = use("App/Notifications/Email");
const PasswordChanged = (exports = module.exports = {
});

PasswordChanged.store = async (user, checkToken, origin) => {
  let urlSystem = process.env.APP_WEB_ADM_URL;
  if (origin === "site") urlSystem = process.env.APP_WEB_URL;

  const userName =
    user.name + (user.last_name !== null ? ` ${user.last_name}` : ``);
  const appName = process.env.APP_NAME;

  await checkToken.delete();

  await Notifications.sendNotification(
    "emails.password-change",
    `Sua senha foi alterada em ${process.env.APP_NAME}`,
    user.email,
    {
      user,
      appName,
      userName,
      urlSystem,
    }
  );
};

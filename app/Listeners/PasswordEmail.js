/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const PasswordEmail = (exports = module.exports = {});
const Notifications = use("App/Notifications/Email");

PasswordEmail.store = async (user, token, origin) => {
  let urlSystem = process.env.APP_WEB_ADM_URL;

  if (origin === "site") urlSystem = process.env.APP_WEB_URL;

  const userName =
    user.name + (user.last_name !== null ? ` ${user.last_name}` : ``);

  await Notifications.sendNotification(
    "emails.email",
    `Link para alterar sua senha em ${process.env.APP_NAME}`,
    user.email,
    {
      user,
      appName: process.env.APP_NAME,
      urlSystem,
      userName,
      token: token.token,
      origin,
    }
  );
};

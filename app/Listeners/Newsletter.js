/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const Newsletter = (exports = module.exports = {});
const Notifications = use("App/Notifications/Email");
const ResourceNotify = use("App/Models/ApplicationNotification");
const ResourceEmail = use("App/Models/ApplicationEmail");
const ResourceConfig = use("App/Models/ApplicationConfiguration");

Newsletter.store = async (newsletter) => {
  await Notifications.sendNotification(
    "emails.newsletters",
    `Você foi cadastrado no nosso boletim`,
    newsletter.email
  );
};

Newsletter.notify = async (newsletter) => {
  const notify = await ResourceNotify.first();

  if (notify !== null && notify.notify_when_new_newsletter) {
    const notifyMail = await ResourceEmail.find(notify.newsletter_email_id);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();

      await Notifications.sendNotification(
        "emails.adm-notifications.new-newsletter",
        `Você recebeu um novo cadastro de e-mail em seu boletim de atualizações`,
        notifyMail.email,
        {
          newsletter,
          baseUrl,
          config,
        }
      );
    }
  }
};

/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const Contact = (exports = module.exports = {});
const Notifications = use("App/Notifications/Email");
const ResourceNotify = use("App/Models/ApplicationNotification");
const ResourceEmail = use("App/Models/ApplicationEmail");
const ResourceConfig = use("App/Models/ApplicationConfiguration");

Contact.store = async (contact) => {
  await Notifications.sendNotification(
    "emails.contact",
    `Sua mensagem foi recebida com sucesso`,
    contact.email,
    {
      message: contact,
    }
  );
};

Contact.notify = async (contact) => {
  const notify = await ResourceNotify.first();

  if (notify !== null && notify.notify_when_new_contact) {
    const notifyMail = await ResourceEmail.find(notify.contact_email_id);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();

      await Notifications.sendNotification(
        "emails.adm-notifications.new-contact",
        `Você recebeu uma nova mensagem de contato através do site`,
        notifyMail.email,
        {
          message: contact,
          baseUrl,
          config,
        }
      );
    }
  }
};

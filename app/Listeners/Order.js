/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const Order = (exports = module.exports = {});
const Notifications = use("App/Notifications/Email");
const Helpers = use("App/Helpers");
const ResourceNotify = use("App/Models/ApplicationNotification");
const ResourceEmail = use("App/Models/ApplicationEmail");
const ResourceConfig = use("App/Models/ApplicationConfiguration");

// Notify client
Order.storeWithdrawInHands = async (order, items, user, coupon, address) => {
  const baseApi = process.env.APP_URL;

  await Notifications.sendNotification(
    "emails.marketplace.withdraw-in-hands",
    `Seu pedido foi recebido com sucesso`,
    user.email,
    {
      order,
      user,
      coupon,
      address,
      items: items.rows,
      helpers: Helpers,
      baseUrl: baseApi,
    }
  );
};

Order.storeBillet = async (order, items, user, coupon, address) => {
  const baseApi = process.env.APP_URL;

  await Notifications.sendNotification(
    "emails.marketplace.billet",
    `Seu pedido foi recebido com sucesso`,
    user.email,
    {
      order,
      user,
      coupon,
      address,
      items: items.rows,
      helpers: Helpers,
      baseUrl: baseApi,
    }
  );
};

Order.storeCreditCard = async (order, items, user, coupon, address) => {
  const baseApi = process.env.APP_URL;

  await Notifications.sendNotification(
    "emails.marketplace.credit-card",
    `Seu pedido foi recebido com sucesso`,
    user.email,
    {
      order,
      user,
      coupon,
      address,
      items: items.rows,
      helpers: Helpers,
      baseUrl: baseApi,
    }
  );
};

Order.orderApproved = async (order, items, user, coupon, address) => {
  const baseApi = process.env.APP_URL;

  await Notifications.sendNotification(
    "emails.marketplace.approved",
    `O seu pagamento para o pedido ${order.id} foi aprovado`,
    user.email,
    {
      order,
      user,
      coupon,
      address,
      items: items.rows,
      helpers: Helpers,
      baseUrl: baseApi,
    }
  );
};

Order.orderCanceled = async (order, items, user, coupon, address) => {
  const baseApi = process.env.APP_URL;
  const urlSystem = process.env.APP_WEB_URL;

  await Notifications.sendNotification(
    "emails.marketplace.canceled",
    `O seu pedido ${order.id} foi cancelado`,
    user.email,
    {
      order,
      user,
      coupon,
      address,
      items: items.rows,
      helpers: Helpers,
      baseUrl: baseApi,
      urlSystem,
    }
  );
};

Order.tracking = async (order, user) => {
  const baseApi = process.env.APP_URL;

  await Notifications.sendNotification(
    "emails.marketplace.tracking",
    `Código de rastreio do seu pedido`,
    user.email,
    {
      order,
      user,
      helpers: Helpers,
      baseUrl: baseApi,
    }
  );
};

// Notify admin
Order.notifyWithdrawInHands = async (order) => {
  const mpConfigurations = await ResourceNotify.first();

  if (mpConfigurations !== null && mpConfigurations.email_id) {
    const notifyMail = await ResourceEmail.find(mpConfigurations.email_id);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();
      await Notifications.sendNotification(
        "emails.adm-notifications.new-order-withdraw-hands",
        `Você recebeu uma ordem de compra para retirada em mãos através do site`,
        notifyMail.email,
        {
          order,
          baseUrl,
          config,
        }
      );
    }
  }
};

Order.notifyBillet = async (order, user, coupon, address) => {};

Order.notifyCanceled = async (order) => {
  const mpConfigurations = await ResourceNotify.first();

  if (mpConfigurations !== null && mpConfigurations.email_id) {
    const notifyMail = await ResourceEmail.find(mpConfigurations.email_id);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();
      await Notifications.sendNotification(
        "emails.adm-notifications.new-order-withdraw-hands",
        `Uma ordem de compra teve seu pagamento cancelado.`,
        notifyMail.email,
        {
          order,
          baseUrl,
          config,
          helpers: Helpers,
        }
      );
    }
  }
};

Order.notifyApproved = async (order) => {
  const mpConfigurations = await ResourceNotify.first();

  if (mpConfigurations !== null && mpConfigurations.email_id) {
    const notifyMail = await ResourceEmail.find(mpConfigurations.email_id);

    if (notifyMail.email !== null) {
      const baseUrl = process.env.APP_WEB_ADM_URL;
      const config = await ResourceConfig.first();
      await Notifications.sendNotification(
        "emails.adm-notifications.new-order-withdraw-hands",
        `Uma ordem de compra teve seu pagamento aprovado.`,
        notifyMail.email,
        {
          order,
          baseUrl,
          config,
          helpers: Helpers,
        }
      );
    }
  }
};

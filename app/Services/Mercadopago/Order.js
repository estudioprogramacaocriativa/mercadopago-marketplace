"use strict";

const MercadoPagoSdk = require("mercadopago");

MercadoPagoSdk.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

class Order {
  static async create({ order, items, preferenceId, customerId }) {
    let resource = null;

    await MercadoPagoSdk.preferences
      .create({
        preference_id: preferenceId,
        application_id: "",
        sponsor_id: "",
        site_id: "",
        payer: customerId,
        items,
        notification_url: `${process.env.APP_URL}/checkout/webhook`,
        statement_descriptor: process.env.APP_NAME,
        external_reference: order.unique_token,
        marketplace: "NONE",
      })
      .then((res) => {
        resource = res.response;
      })
      .catch();

    return resource;
  }
}

module.exports = Order;

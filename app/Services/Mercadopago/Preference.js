"use strict";

const MercadoPagoSdk = require("mercadopago");

MercadoPagoSdk.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

class Preference {
  static async create({ order, items, customerId }) {
    let preference = null;

    await MercadoPagoSdk.preferences
      .create({
        items,
        payer: customerId,
        notification_url: `${process.env.APP_URL}/checkout/webhook`,
        statement_descriptor: process.env.APP_NAME,
        external_reference: order.unique_token,
      })
      .then((res) => {
        preference = res.response;
      })
      .catch();

    return preference;
  }
}

module.exports = Preference;

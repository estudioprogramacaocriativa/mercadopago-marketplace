"use strict";

const MercadoPagoSdk = require("mercadopago");

const User = use("App/Models/User");
const MarketplaceReseler = use("App/Models/MarketplaceReseler");
const MercadoPagoConfiguration = use(
  "App/Models/ApplicationMercadoPagoConfiguration"
);
// MercadoPagoSdk.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

class Customer {
  static async getConfig() {
    const config = await MercadoPagoConfiguration.first();
    return config;
  }

  static async search(field, value, user = null) {
    const mercadopago = MercadoPagoSdk;

    const data = {
      [field]: value,
    };

    let customer = null;

    const marketplaceConfig = await this.getConfig();

    // ACCESS TOKEN
    if (user !== null && user !== undefined) {
      const marketplaceReseler = await MarketplaceReseler.findBy(
        "user_id",
        user.user_id
      );

      if (
        user.user_id !== null &&
        user.user_id !== undefined &&
        marketplaceReseler !== null
      ) {
        if (marketplaceReseler.access_token !== null) {
          mercadopago.configurations.setAccessToken(
            marketplaceReseler.access_token
          );
        }
      } else {
        mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
      }
    } else {
      mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
    }

    await mercadopago.customers
      .search({
        qs: data,
      })
      .then((res) => {
        [customer] = res.body.results;
      })
      .catch((err) => {
        console.log(err);
      });

    return customer;
  }

  static async create(payload, user) {
    const marketplaceConfig = await this.getConfig();
    const mercadopago = MercadoPagoSdk;

    // ACCESS TOKEN
    if (user !== null && user !== undefined) {
      const marketplaceReseler = await MarketplaceReseler.findBy(
        "user_id",
        user.user_id
      );

      if (
        user.user_id !== null &&
        user.user_id !== undefined &&
        marketplaceReseler !== null
      ) {
        if (marketplaceReseler.access_token !== null) {
          mercadopago.configurations.setAccessToken(
            marketplaceReseler.access_token
          );
        }
      } else {
        mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
      }
    } else {
      mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
    }

    const data = {
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phone: payload.phone,
      identification: payload.identification,
      address: payload.address,
    };

    let customer = null;

    const findCustomer = await this.search("email", payload.email);

    if (findCustomer !== undefined && findCustomer !== null) {
      delete data.email;

      data.id = findCustomer.id;

      await MercadoPagoSdk.customers
        .update(data)
        .then(async (res) => {
          customer = res.response;

          if (user.customer_mp_id === null || user.customer_mp_id === undefined)
            await User.query().where("id", user.id).update({
              customer_mp_id: customer.id,
            });
        })
        .catch((err) => {
          console.log("error update customer");
          console.log(err);
        });
    } else {
      await MercadoPagoSdk.customers
        .create(data)
        .then(async (res) => {
          customer = res.response;

          if (user.customer_mp_id === null || user.customer_mp_id === undefined)
            await User.query().where("id", user.id).update({
              customer_mp_id: customer.id,
            });
        })
        .catch((err) => {
          console.log("error create customer");
          console.log(err);
        });
    }

    return customer;
  }

  static async delete(id) {
    await MercadoPagoSdk.customers.remove(id);
  }
}

module.exports = Customer;

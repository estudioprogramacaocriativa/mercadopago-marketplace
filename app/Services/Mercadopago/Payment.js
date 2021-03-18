/* eslint-disable prettier/prettier */

"use strict";

const MercadoPagoSdk = use("mercadopago");
const MercadoPagoConfiguration = use("App/Models/ApplicationMercadoPagoConfiguration");
const MarketplaceReseler = use("App/Models/MarketplaceReseler");
const Order = use("App/Models/Order");
const Helper = use("App/Helpers");

class Customer {
  static async getConfig() {
    const config = await MercadoPagoConfiguration.first();
    return config;
  }

  static async search(field, value) {
    const data = {
      [field]: value,
    };

    let payment = null;

    await MercadoPagoSdk.payment
      .search({
        qs: data,
      })
      .then((res) => {
        [payment] = res.body.results;
      })
      .catch((err) => {
        console.log(err);
      });

    return payment;
  }

  static async show(id) {
    let order;

    await MercadoPagoSdk.payment.findById(id).then((res) => {
      const { response } = res;

      order = response;
    });

    return order;
  }

  static async create(payload, orderId, user, customer) {
    const mercadopago = MercadoPagoSdk;

    // MARKETPLACE CONFIGURATION
    const marketplaceConfig = await this.getConfig();

    let split = false;

    // ACCESS TOKEN
    if(user !== null && user !== undefined) {
      const marketplaceReseler = await MarketplaceReseler.findBy("user_id", user.user_id);

      if(user.user_id !== null && user.user_id !== undefined && marketplaceReseler !== null) {
        if(marketplaceReseler.access_token !== null) {
          await mercadopago.configurations.setAccessToken(marketplaceReseler.access_token);
          split = true;
        }
      } else {
        await mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
        split = false;
      }
    } else {
      await mercadopago.configurations.setAccessToken(marketplaceConfig.secret_key);
      split = true;
    }

    // PREFERENCE
    const customItems = payload.additional_info.items.map((el) => {
      el.currency_id = "BRL";
      return el;
    });

    const preferenceData = {
      items: customItems,
      payer: {
        name: `${payload.payer.info.first_name} ${payload.payer.info.last_name}`,
        surname: payload.payer.info.nickname || payload.payer.info.first_name,
        email: payload.payer.info.email,
        address: payload.payer.address,
        phone: {
          area_code: String(payload.payer.phone.area_code),
          number: Number(payload.payer.phone.number),
        },
        identification: payload.payer.identification,
      },
      shipments: {
        receiver_address: payload.payer.receiver_address,
      },
      notification_url: `${process.env.APP_URL}/site/checkout/webhook`,
      statement_descriptor: payload.statement_descriptor,
      marketplace_fee: 0,
    };

    if(
      marketplaceConfig !== null &&
      marketplaceConfig !== undefined &&
      marketplaceConfig.days_to_expirate_billet !== null &&
      marketplaceConfig.days_to_expirate_billet !== undefined
    ) {
      const date = new Date();
      date.setDate(date.getDate() + marketplaceConfig.days_to_expirate_billet);
      const formatDate = `${date.getUTCFullYear()
        }-${  Helper.pad(date.getUTCMonth() + 1)
        }-${  Helper.pad(date.getUTCDate())
        }T${  Helper.pad(date.getUTCHours())
        }:${  Helper.pad(date.getUTCMinutes())
        }:${  Helper.pad(date.getUTCSeconds())
        }.${  (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
        }-00:00`;

      preferenceData.expires = true;
      preferenceData.expiration_date_to = formatDate;
    }

    if(
      marketplaceConfig !== null &&
      marketplaceConfig !== undefined &&
      marketplaceConfig.app_id !== null &&
      marketplaceConfig.app_id !== undefined
    ) {
      preferenceData.marketplace = `MP-MKT-${marketplaceConfig.app_id}`;
    }

    let calculateMarketplaceFee = 0;

    if(split && marketplaceConfig !== null &&
      marketplaceConfig !== undefined &&
      marketplaceConfig.comission_fee !== null &&
      marketplaceConfig.comission_fee !== null
    ) {
      calculateMarketplaceFee = payload.amount - ((marketplaceConfig.comission_fee / 100) * payload.amount);
    }

    if(split) preferenceData.marketplace_fee = calculateMarketplaceFee;

    const preference = await mercadopago.preferences.create(preferenceData);

    await Order.query().where("id", orderId).update({
      mp_preference_id: preference.body.id
    });

    // ORDER DATA
    const orderData = {
      application_id: marketplaceConfig.app_id,
      preference_id: preference.body.id,
      items: customItems,
      external_reference: payload.external_reference,
      notification_url: `${process.env.APP_URL}/site/checkout/webhook`
    };

    if(marketplaceConfig !== null &&
      marketplaceConfig !== undefined &&
      marketplaceConfig.app_id !== null &&
      marketplaceConfig.app_id !== undefined
    ) {
      orderData.marketplace = `MP-MKT-${marketplaceConfig.app_id}`;
    }

    // MERCADOPAGO ORDER
    const merchantOrder = await mercadopago.merchant_orders.create(orderData);

    await Order.query().where("id", orderId).update({
      mp_order_id: merchantOrder.body.id
    });

    // PAYMENT
    const customItemsPay = payload.additional_info.items.map((el) => {
      delete el.currency_id;
      return el;
    });

    const registeredDate = new Date(payload.payer.info.created_at);
    const formatRegisteredDate = `${registeredDate.getUTCFullYear()
        }-${  Helper.pad(registeredDate.getUTCMonth() + 1)
        }-${  Helper.pad(registeredDate.getUTCDate())
        }T${  Helper.pad(registeredDate.getUTCHours())
        }:${  Helper.pad(registeredDate.getUTCMinutes())
        }:${  Helper.pad(registeredDate.getUTCSeconds())
        }.${  (registeredDate.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
        }-00:00`;

    const paymentData = {
      order: {
        type: 'mercadopago',
        id: merchantOrder.body.id
      },
      payer: {
        id: String(customer.id),
        type: 'customer',
        email: customer.email,
        first_name: customer.first_name,
        last_name: customer.last_name,
        identification: customer.identification,
      },
      installments: payload.installments,
      transaction_amount: payload.amount,
      description: payload.description,
      payment_method_id: payload.method_id,
      statement_descriptor: payload.statement_descriptor,
      notification_url: `${process.env.APP_URL}/site/checkout/webhook`,
      additional_info: {
        items: customItemsPay,
        payer: {
          first_name: payload.payer.info.first_name,
          last_name: payload.payer.info.last_name,
          address: payload.payer.address,
          registration_date: formatRegisteredDate,
          phone: {
            area_code: payload.payer.phone.area_code,
            number: payload.payer.phone.number,
          },
        },
        shipments: {
          receiver_address: payload.payer.receiver_address,
        },
      },
    };

    // console.log(paymentData.payer);

    if (payload.type === "creditCard") paymentData.token = payload.token;
    if(parseInt(payload.coupon_amount, 10) > 0) paymentData.coupon_amount = payload.coupon_amount;

    const payment = await MercadoPagoSdk.payment
      .create(paymentData)
      .then(async (data) => {
        const { response } = data;

        const updatePayload = {
          billet_url: response.transaction_details.external_resource_url,
          mp_payment_id: response.id,
          status_detail: response.status_detail,
          status: response.status,
        };

        if (response.fee_details) {
          const mpFees = Array.from(response.fee_details).filter(el =>
            el.type === "mercadopago_fee"
          );

          if(mpFees.length > 0) updatePayload.fees = mpFees[0].amount;
        }

        const mPOrder = await Order.query().where("id", orderId).update(updatePayload);

        return mPOrder;
      })
      .catch((error) => {
        console.log('Error when process payment');
        console.log(error);
      });

      return payment;
  }
}

module.exports = Customer;

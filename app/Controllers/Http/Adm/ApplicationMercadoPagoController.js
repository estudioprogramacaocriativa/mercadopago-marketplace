"use strict";

const Resource = use("App/Models/ApplicationMercadoPagoConfiguration");

class ApplicationMercadoPagoController {
  async show() {
    const resource = await Resource.query().first();

    return {
      data: {
        resource,
      },
    };
  }

  async update({ request }) {
    const {
      daysToExpirateBillet,
      paymentOptions,
      secretKey,
      publicKey,
      appId,
      emailId,
      isActive,
      comissionFee,
    } = request.all();
    const find = await Resource.query().first();

    const data = {
      days_to_expirate_billet: daysToExpirateBillet,
      payment_options: paymentOptions.join(","),
      secret_key: secretKey,
      public_key: publicKey,
      app_id: appId,
      comission_fee: comissionFee,
      is_active: isActive,
      email_id: emailId,
    };

    if (find) {
      find.merge(data);
      await find.save();
    } else await Resource.create(data);

    return {
      data: {
        message: "As configurações do Mercado Pago foram atualizadas!",
      },
    };
  }
}

module.exports = ApplicationMercadoPagoController;

"use strict";

const Resource = use("App/Models/ApplicationConfiguration");

class ApplicationConfigurationController {
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
      fantasyName,
      socialName,
      publicEmailId,
      whatsappMessage,
      phoneSupport,
      phoneWhatsapp,
      phoneTelegram,
      cnpj,
      about,
      address,
      maintenance,
    } = request.all();

    const find = await Resource.query().first();
    const data = {
      maintenance,
      fantasy_name: fantasyName || null,
      social_name: socialName || null,
      public_email_id: publicEmailId || null,
      phone_support: phoneSupport || null,
      phone_whatsapp: phoneWhatsapp || null,
      phone_telegram: phoneTelegram || null,
      whatsapp_message: whatsappMessage || null,
      cnpj: cnpj || null,
      about: about || null,
      zip_code: address.zipCode || null,
      public_place: address.publicPlace || null,
      public_place_number: address.publicPlaceNumber || null,
      city: address.city || null,
      district: address.district || null,
      state: address.state || null,
      complement: address.complement || null,
    };

    if (find) {
      find.merge(data);
      await find.save();
    } else await Resource.create(data);

    return {
      data: {
        message: "As configurações da aplicação foram atualizadas!",
      },
    };
  }
}

module.exports = ApplicationConfigurationController;

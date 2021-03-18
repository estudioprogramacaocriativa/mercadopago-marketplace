"use strict";

const User = use("App/Models/User");
const CustomHelper = use("App/Helpers");

class ValidateController {
  async existEmail({ request }) {
    const { email, id } = request.all();

    let payload = User.query().where("email", email);

    if (id !== null && id !== undefined)
      payload = payload.where("id", "!=", id);

    payload = await payload.first();

    const response = payload === null;
    return {
      data: {
        response,
      },
    };
  }

  async existDocument({ request }) {
    const data = request.only(["document", "id"]);
    const id = data.id ? data.id : null;
    const document = CustomHelper.toNumber(data.document);

    let payload = User.query().where("cpf", document);

    if (id !== null) payload = payload.where("id", "!=", id);

    payload = await payload.first();

    const response = payload === null;
    return {
      data: {
        response,
      },
    };
  }

  async existPhone({ request }) {
    const data = request.only(["phone", "id"]);
    const id = data.id ? data.id : null;
    const cleanPhone = CustomHelper.toNumber(data.phone);

    let payload = User.query().where("phone", cleanPhone);

    if (id !== null) payload = payload.where("id", "!=", id);

    payload = await payload.first();

    const response = payload === null;
    return {
      data: {
        response,
      },
    };
  }

  async isValidDocument({ request }) {
    const document = request.only("document");
    const cleanDocument = CustomHelper.toNumber(document.document);
    const response = CustomHelper.cpfValidate(cleanDocument);
    return {
      data: {
        response,
      },
    };
  }
}

module.exports = ValidateController;

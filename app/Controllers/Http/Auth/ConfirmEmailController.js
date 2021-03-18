"use strict";

const Resource = use("App/Models/ConfirmEmail");
const Event = use("Event");

class ConfirmEmailController {
  async show({ request, response }) {
    const { token } = request.all();

    if (!token) {
      return response.status(404).json({
        data: {
          invalidToken: true,
          message: "O token da requisição não foi informado",
        },
      });
    }

    const userByToken = await Resource.findBy("first_access_hash", token);

    if (!userByToken) {
      return response.status(404).json({
        data: {
          invalidToken: true,
          message: "O token da requisição não é válido",
        },
      });
    }

    if (userByToken.password && !userByToken.email_verified_at) {
      const date = new Date();
      const finalDate = `${date.toISOString().split("T")[0]} ${
        date.toTimeString().split(" ")[0]
      }`;

      userByToken.merge({
        email_verified_at: finalDate,
      });
      await userByToken.save();
    }

    return {
      data: {
        invalidToken: false,
        hasPassword: !!userByToken.password,
        status: !!userByToken.email_verified_at,
      },
    };
  }

  async update({ request, response }) {
    const { token, password } = request.all();

    if (!token) {
      return response.status(404).json({
        data: {
          invalidToken: true,
          message: "O token da requisição não foi informado",
        },
      });
    }

    const userByToken = await Resource.findBy("first_access_hash", token);

    if (!userByToken) {
      return response.status(400).json({
        data: {
          invalidToken: true,
          message: "O token da requisição não é válido",
        },
      });
    }

    const date = new Date();
    const finalDate = `${date.toISOString().split("T")[0]} ${
      date.toTimeString().split(" ")[0]
    }`;

    userByToken.merge({
      password,
      email_verified_at: finalDate,
    });
    await userByToken.save();

    return {
      data: {
        invalidToken: false,
        message: "Seu e-mail foi confirmado com sucesso!",
        hasPassword: !!userByToken.password,
        status: !!userByToken.email_verified_at,
      },
    };
  }
}

module.exports = ConfirmEmailController;

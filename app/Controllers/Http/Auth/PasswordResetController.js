"use strict";

const PasswordReset = use("App/Models/PasswordReset");
const User = use("App/Models/User");
const RandomString = use("randomstring");
const Event = use("Event");

class PasswordResetController {
  async store({ request, response }) {
    const { email, origin } = request.all();
    const newToken = `${RandomString.generate({
      length: 40,
    })}-${email}`;
    const token = await PasswordReset.create({
      email,
      token: newToken,
    });
    const user = await User.findBy("email", email);

    if (!user)
      return response.status(404).json({
        data: {
          message: "O e-mail informado não foi encontrado",
        },
      });

    Event.fire("password::email", user, token, origin);

    return {
      data: {
        message:
          "Enviamos um link para o seu e-mail com o token para alterar sua senha de acesso",
      },
    };
  }
}

module.exports = PasswordResetController;

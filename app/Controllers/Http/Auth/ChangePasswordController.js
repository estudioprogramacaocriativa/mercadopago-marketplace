"use strict";

const PasswordReset = use("App/Models/PasswordReset");
const User = use("App/Models/User");
const Hash = use("Hash");
const Event = use("Event");

class ChangePasswordController {
  async change({ request, response }) {
    const { password, token, origin } = request.all();

    if (!token) {
      return response.status(404).json({
        data: {
          message: "Não foi possível identificar o token da requisição",
        },
      });
    }

    const checkToken = await PasswordReset.findBy("token", token);
    const now = new Date();

    if (checkToken === null) {
      return response.status(401).send({
        data: {
          message:
            "O token dessa requisição é inválido ou expirou. Reinicie o processo e certifique-se de clicar no link enviado ao seu e-mail.",
        },
      });
    }

    const hours = Math.abs(checkToken.created_at - now) / 36e5;

    if (hours > 1) {
      return response.status(401).send({
        data: {
          message:
            "Esse link expirou. Você tem até 1 hora após a sua solicitação para realizar a troca da sua senha antes da expiração do link.",
        },
      });
    }

    const { email } = checkToken;
    const user = await User.findByOrFail("email", email);
    const dataPassword = await Hash.make(password);

    await User.query().where("id", user.id).update({
      password: dataPassword,
    });

    Event.fire("password::changed", user, checkToken, origin);

    return response.json({
      data: {
        email: user.email,
        message: "Sua senha foi alterada com sucesso",
      },
    });
  }
}

module.exports = ChangePasswordController;

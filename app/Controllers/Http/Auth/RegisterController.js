"use strict";

const User = use("App/Models/User");
const Event = use("Event");

class RegisterController {
  async store({ request, response }) {
    const {
      password: showPassword,
      email,
      password,
      firstAccessHash,
      activationCode,
      userId,
    } = request.all();

    let relatedUserId;

    if (userId) {
      const reselerRef = await User.findBy("nickname", userId);

      relatedUserId = reselerRef.id;
    }

    const user = await User.create({
      email,
      password,
      first_access_hash: firstAccessHash,
      activation_code: activationCode,
      role: "client",
      user_id: relatedUserId,
    });

    Event.fire("user::register", user, showPassword);
    Event.fire("user::notify", user);

    return response.json({
      data: {
        message: `Sua conta foi criada. Enviamos uma mensagem de ativação de conta para o e-mail informado. Verifique também sua caixa de SPAM e sua Lixeira.`,
        user,
      },
    });
  }
}

module.exports = RegisterController;

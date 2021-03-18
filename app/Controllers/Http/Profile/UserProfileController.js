"use strict";

const Resource = use("App/Models/Profile");
const messageSuccess = "Os seus dados de perfil foram atualizados com sucesso!";
const messageFail =
  "Não foi possível identificar sua conta. Por favor, atualize a página e tente novamente.";

class UserProfileController {
  async update({ request, response, auth }) {
    const authUser = await auth.getUser();
    const { name, lastName, birthDate, phone, cpf, nickname } = request.all();
    const user = await Resource.find(authUser.id);

    if (!authUser) {
      return response.status(401).json({
        data: {
          message: messageFail,
        },
      });
    }

    user.merge({
      name,
      last_name: lastName,
      birth_date: birthDate,
      nickname,
      phone,
      cpf,
    });

    await user.save();

    return {
      data: {
        message: messageSuccess,
      },
    };
  }
}

module.exports = UserProfileController;

"use strict";

const Resource = use("App/Models/Access");
const messageSuccess = "Os seus dados de acesso foram atualizados com sucesso!";
const messageFail =
  "Não foi possível identificar sua conta. Por favor, atualize a página e tente novamente!";

class UserAccessController {
  async update({ request, response, auth }) {
    const authUser = await auth.getUser();
    const { password, email } = request.all();
    const user = await Resource.find(authUser.id);

    if (!authUser) {
      return response.status(401).json({
        data: {
          message: messageFail,
        },
      });
    }

    if (email)
      user.merge({
        email,
      });

    if (password)
      user.merge({
        password,
      });

    await user.save();

    return {
      data: {
        message: messageSuccess,
      },
    };
  }
}

module.exports = UserAccessController;

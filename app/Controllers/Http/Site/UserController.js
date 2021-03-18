"use strict";

class UserController {
  async show({ auth, response }) {
    try {
      const user = await auth.getUser();

      return {
        data: {
          user,
        },
      };
    } catch (error) {
      return response.status(400).send({
        data: {
          message: "Requisição inválida",
        },
      });
    }
  }

  async update({ auth, request, response }) {
    const user = await auth.getUser();

    try {
      const { name, lastName, cpf, birthDate, phone } = request.all();

      user.merge({
        cpf,
        name,
        phone,
        last_name: lastName,
        birth_date: birthDate,
      });

      await user.save();

      return {
        data: {
          message: "Seus dados foram atualizados com sucesso!",
        },
      };
    } catch (error) {
      return response.status(400).send({
        data: {
          message:
            "Não foi possível atualizar seus dados! " +
            "Por favor tente novamente em alguns segundos.",
        },
      });
    }
  }
}

module.exports = UserController;

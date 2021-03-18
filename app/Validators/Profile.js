/* eslint-disable no-underscore-dangle */

"use strict";

class Profile {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.request._all;

    return {
      name: "required",
      lastName: "required",
      birthDate: "required",
      phone: "required",
      nickname: `required|exists:users,nickname,id,${id}`,
      cpf: `required|exists:users,cpf,id,${id}`,
    };
  }

  get messages() {
    const translate = {
      name: "nome",
      lastName: "sobrenome",
      birthDate: "data de nascimento",
      phone: "telefone",
      cpf: "CPF",
      nickname: "apelido",
    };

    return {
      // eslint-disable-next-line prettier/prettier
      required: field => `O campo ${translate[field]} é obrigatório`,
      "cpf.exists": "O CPF informado já está cadastrado para outra conta",
      "nickname.exists":
        "O apelido informado já está cadastrado para outra conta",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Profile;

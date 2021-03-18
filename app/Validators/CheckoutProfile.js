/* eslint-disable no-underscore-dangle */

"use strict";

class CheckoutProfile {
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
    };

    return {
      // eslint-disable-next-line prettier/prettier
      required: field => `O campo ${translate[field]} é obrigatório`,
      "cpf.exists": "O CPF informado já está cadastrado para outra conta",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = CheckoutProfile;

/* eslint-disable arrow-parens */

"use strict";

class Newsletter {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;

    return {
      email: `required|email|unique:newsletters,email,id,${id}`,
    };
  }

  get messages() {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      "email.unique": "O e-mail informado já está cadastrado",
      "email.email": "O e-mail informado não é válido",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Newsletter;

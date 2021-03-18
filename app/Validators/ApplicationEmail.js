/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */

"use strict";

class ApplicationEmail {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;

    return {
      email: `required|email|unique:application_emails,email,id,${id}`,
    };
  }

  get messages() {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      "email.email": "O e-mail informado não possui um formato válido",
      "email.unique": "Esse e-mail já está cadastrado",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = ApplicationEmail;

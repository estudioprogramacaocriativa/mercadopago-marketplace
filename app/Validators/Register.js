"use strict";

class Register {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      password: "required|min:8",
      email: "required|email|unique:users,email",
    };
  }

  get messages() {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      "email.email": "O e-mail informado não é válido",
      "email.unique": "O e-mail informado não está disponível",
      "password.min": "A sua senha precisa ter no mínimo 8 dígitos",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Register;

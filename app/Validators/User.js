/* eslint-disable prettier/prettier */

"use strict";

class Register {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;

    return {
      email: `required|email|unique:users,email,id,${id}`,
      cpf: `exists:users,cpf,id,${id}`,
      nickname: `exists:users,nickname,id,${id}`,
      password: "min:8",
      role: "required",
    };
  }

  get messages() {
    return {
      required: field => `O campo ${field} é obrigatório`,
      "email.email": "O e-mail informado não é válido",
      "email.unique": "O e-mail informado não está disponível",
      "password.min": "A senha precisa ter no mínimo 8 dígitos",
      "cpf.exists": "O CPF informado já está cadastrado para outra conta",
      "nickname.exists": "O Nickname informado já está cadastrado para outra conta",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Register;

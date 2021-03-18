"use strict";

class Reseler {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: "required",
      lastName: "required",
      birthDate: "required",
      email: "required|email|unique:users,email",
      cpf: "required|exists:users,cpf",
      phone: "required",
      picFile: "required",
      docFile: "required",
      picDocFile: "required",
      termFile: "required",
      zipCode: "required",
      publicPlace: "required",
      publicPlaceNumber: "required",
      district: "required",
      state: "required",
      city: "required",
    };
  }

  get messages() {
    return {
      // eslint-disable-next-line arrow-parens
      required: (field) => `O campo ${field} é obrigatório`,
      "email.email": "O e-mail informado não é válido",
      "email.unique": "O e-mail informado não está disponível",
      "cpf.exists": "O CPF informado não está disponível",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Reseler;

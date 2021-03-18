/* eslint-disable prettier/prettier */

"use strict";

class Register {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;

    return {
      name: "required",
      lastName: "required",
      birthDate: "required",
      phone: "required",
      email: `required|email|unique:users,email,id,${id}`,
      cpf: `exists:users,cpf,id,${id}`,
      password: "min:8",

      zipCode: "required_when:role,reseler|required_when:role,client",
      publicPlace: "required_when:role,reseler|required_when:role,client",
      publicPlaceNumber: "required_when:role,reseler|required_when:role,client",
      district: "required_when:role,reseler|required_when:role,client",
      state: "required_when:role,reseler|required_when:role,client",
      city: "required_when:role,reseler|required_when:role,client",

      document: "required_when:role,reseler",
      selfieFace: "required_when:role,reseler",
      selfieDocument: "required_when:role,reseler",
      terms: "required_when:role,reseler",
      statusDocuments: "required_when:role,reseler",
      documentStatus: "required_when:role,reseler",
      selfieDocumentStatus: "required_when:role,reseler",
      selfieFaceStatus: "required_when:role,reseler",
      termsStatus: "required_when:role,reseler",
    };
  }

  get messages() {
    return {
      required: field => `O campo ${field} é obrigatório`,
      required_when: field => `O campo ${field} é obrigatório`,
      "email.email": "O e-mail informado não é válido",
      "email.unique": "O e-mail informado não está disponível",
      "password.min": "A senha precisa ter no mínimo 8 dígitos",
      "cpf.exists": "O CPF informado já está cadastrado para outra conta",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Register;

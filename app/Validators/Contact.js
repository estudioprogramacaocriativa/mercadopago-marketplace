'use strict';

class Contact {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: 'required',
      email: 'required|email',
      subject: 'required',
      message: 'required',
    };
  }

  get messages() {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      'email.email': 'O e-mail informado não é válido',
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Contact;

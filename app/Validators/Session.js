'use strict'

class Session {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      'email': 'required|email',
      'password': 'required|min:8'
    }
  }

  get messages() {
    return {
      'email.required': 'Informe o seu e-mail de acesso',
      'email.email': 'O e-mail informado não é válido',
      'password.required': 'Informe a sua senha de acesso',
      'password.min': 'A sua senha precisa ter no mínimo 8 dígitos'
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message
    });
  }
}

module.exports = Session

'use strict'

class PasswordEmail {
  get validateAll () {
    return true;
  }

  get rules () {
    return {
      'email': 'required|email'
    }
  }

  get messages () {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      'email.email': 'O e-mail informado não é válido'
    }
  }

  async fails (message) {
    return this.ctx.response.status(402).json({
      data: message
    })
  }
}

module.exports = PasswordEmail

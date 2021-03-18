'use strict'

class PasswordChange {
  get validateAll () {
    return true;
  }

  get rules () {
    return {
      'password': 'required|confirmed|min:8',
      'password_confirmation': 'required'
    }
  }

  get messages () {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      'password_confirmation.required': 'O campo confirme a senha é obrigatório',
      'password.confirmed': 'As senha digitadas devem ser iguais',
      'password.min': 'A nova senha deve ter no mínimo 8 dígitos'
    }
  }

  async fails (message) {
    return this.ctx.response.status(402).json({
      data: message
    })
  }
}

module.exports = PasswordChange

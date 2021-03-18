'use strict';

class Access {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.request._all;

    return {
      email: `required|email|unique:users,email,id,${id}`,
      password: 'required|confirmed|min:8',
      password_confirmation: 'required',
    };
  }

  get messages() {
    const translate = {
      email: 'e-mail',
      password: 'senha',
      password_confirmation: 'confirmação de senha',
    };

    return {
      required: (field) => `O campo ${translate[field]} é obrigatório`,
      'password.confirmed': 'As senha digitadas precisam ser iguais',
      'password.min': 'A nova senha precisa ter no mínimo 8 dígitos',
      'email.unique': 'O e-mail informado já está cadastrado para outra conta',
      'email.email': 'O e-mail informado não é válido',
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Access;

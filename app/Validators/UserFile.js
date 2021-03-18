'use strict';

class UserFile {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      document: 'required',
      selfieFace: 'required',
      selfieDocument: 'required',
      terms: 'required',
    };
  }

  get messages() {
    const translate = {
      document: 'documento',
      selfieFace: 'foto do documento',
      selfieDocument: 'foto do seu resto',
      terms: 'termos',
    };

    return {
      required: field => `O campo ${translate[field]} é obrigatório!`,
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = UserFile;

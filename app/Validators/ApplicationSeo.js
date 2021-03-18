'use strict';

class ApplicationSeo {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      title: 'max:70',
      description: 'max:160',
    };
  }

  get messages() {
    return {
      'title.max': `O título deve ter no máximo 70 caracteres`,
      'description.max': `A descrição deve ter no máximo 160 caracteres`,
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = ApplicationSeo;

'use strict'

class ProductCategory {
  get validateAll() {
    return true;
  }

  get rules() {
    const id = this.ctx.params.id;

    return {
      title: `required|unique:product_categories,title,id,${id}`,
    };
  }

  get messages() {
    const title = this.ctx.request.body.title;

    return {
      required: (field) => `O campo ${field} é obrigatório`,
      "title.unique": `A categoria ${title} não está disponível`,
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = ProductCategory

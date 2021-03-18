/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-parens */

"use strict";

class Product {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;
    const { inventoryType } = this.ctx.request._all;

    return {
      model: `required|unique:products,model,id,${id}`,
      code: `required|unique:products,code,id,${id}`,
      price: `required_when:${inventoryType},single`,
      categoryId: "required",
    };
  }

  get messages() {
    return {
      required: (field) => `O campo ${field} é obrigatório`,
      "model.unique": "Já existe outro modelo cadastrado com esse valor",
      "code.unique": "Já existe outro código cadastrado com esse valor",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Product;

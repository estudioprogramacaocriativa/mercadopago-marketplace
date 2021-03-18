"use strict";

class Slider {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      imageBig: "required_when:productId,null",
      title: "required_when:productId,null",
      productId: "required_when:type,product",
    };
  }

  get messages() {
    return {
      "title.required_when": "O campo título é obrigatório",
      "imageBig.required_when": "Informe a imagem para o banner",
      "productId.required_when": "Informe o produto relacionado",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Slider;

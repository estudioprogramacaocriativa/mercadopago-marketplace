"use strict";

class ProductImport {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      file: "required",
    };
  }

  get messages() {
    return {
      "file.required": "Informe o arquivo",
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = ProductImport;

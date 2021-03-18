"use strict";

const Resource = use("App/Models/ProductColor");

const messages = {
  notFound: "A variação de cor solicitada não foi encontrada!",
  deleted: "A variação de cor foi deletada permanentemente!",
  notDeleted:
    "Não foi possível remover a variação de cor no momento! " +
    "Isso ocorre porque existem pedidos na loja onde esse item " +
    "foi adicionado.",
};

class ProductColorController {
  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: messages.notFound,
        },
      });
    }

    try {
      await resource.delete();

      return {
        data: {
          message: messages.deleted,
        },
      };
    } catch (e) {
      return response.status(400).json({
        data: {
          message: messages.notDeleted,
        },
      });
    }
  }
}

module.exports = ProductColorController;

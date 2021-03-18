"use strict";

const Resource = use("App/Models/ProductSize");

const messages = {
  notFound: "A variação de tamanho solicitada não foi encontrada!",
  deleted: "A variação de tamanho foi deletada permanentemente!",
  notDeleted:
    "Não foi possível remover a variação de tamanho no momento! " +
    "Para executar essa ação, você  precisa, primeiro, remover " +
    "todas as cores relaciondas.",
};

class ProductSizeController {
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

module.exports = ProductSizeController;

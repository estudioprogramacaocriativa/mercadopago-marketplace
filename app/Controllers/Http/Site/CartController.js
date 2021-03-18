"use strict";

const ProductInventory = use("App/Models/ProductInventory");

class CartController {
  async index({ request }) {
    const { items } = request.all();

    if (!items)
      return {
        data: {
          resources: [],
        },
      };

    const resources = await ProductInventory.query()
      .whereIn("id", items)
      .with("product")
      .with("size")
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }

  async show({ params, request, response }) {
    const { id } = params;
    const { qty } = request.all();
    const resource = await ProductInventory.query()
      .select("id", "product_id", "size_id", "color_id", "inventory")
      .where("id", id)
      .with("product", (builder) => {
        builder.with("imageCover");
        builder.select(
          "id",
          "model",
          "reference",
          "code",
          "friendly_url",
          "headline",
          "description",
          "price",
          "promotional_price",
          "promotional_start",
          "promotional_end",
          "category_id",
          "width",
          "height",
          "length",
          "weight"
        );
      })
      .with("color.inventory")
      .with("size.inventory")
      .first();

    if (!qty) {
      return response.status(402).json({
        data: {
          message: `Não foi informada a quantidade`,
        },
      });
    }

    if (!resource) {
      return response.status(403).json({
        data: {
          message: `Não foi possível identificar o estoque do produto selecionado`,
        },
      });
    }

    if (resource.inventory <= 0) {
      return response.status(404).json({
        data: {
          message: `O produto selecionado está fora de estoque!`,
        },
      });
    }

    if (resource.inventory < qty) {
      resource.qty = resource.inventory;

      return {
        data: {
          message: `Só temos ${resource.inventory} unidade${
            resource.inventory > 1 ? "s" : ""
          } desse item disponíve${
            resource.inventory > 1 ? "is" : "l"
          } em estoque!`,
          resource,
        },
      };
    }

    resource.qty = qty;

    return {
      data: {
        resource,
      },
    };
  }
}

module.exports = CartController;

"use strict";

const Order = use("App/Models/Order");

class OrderController {
  async index({ auth, request }) {
    const req = request.all();
    const offset = req.offset ? parseInt(req.offset, 10) : 1;
    const limit = req.limit ? parseInt(req.limit, 10) : 12;
    const paginate = req.paginate ? req.paginate : true;
    const user = await auth.getUser();

    let resources = Order.query()
      .orderBy("created_at", "desc")
      .where("user_id", user.id);

    if (req.limit) resources = resources.limit(limit);

    if (paginate === "false") resources = await resources.fetch();
    else resources = await resources.paginate(offset, limit);

    return {
      data: {
        resources,
      },
    };
  }

  async show({ params, response }) {
    const { id } = params;

    const find = await Order.query()
      .with("items.inventory.product.imageCover")
      .with("items.inventory.size")
      .with("items.inventory.color")
      .with("address")
      .where("id", id)
      .first();

    if (find === null) {
      return response.status().json({
        data: {
          message:
            "Não foi possível localizar o pedido selecionado para sua conta",
        },
      });
    }

    return {
      data: {
        resource: find,
      },
    };
  }
}

module.exports = OrderController;

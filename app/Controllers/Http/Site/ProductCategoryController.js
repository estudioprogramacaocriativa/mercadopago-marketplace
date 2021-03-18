"use strict";

const Resource = use("App/Models/ProductCategory");

class ProductCategoryController {
  async index() {
    const resources = await Resource.query()
      .where("status", "published")
      .whereHas("products", (builder) => {
        builder.where("status", "published");
        builder.whereHas(
          "images",
          (qb) => {
            qb.where("id", ">", 0);
          },
          ">",
          0
        );
      })
      .orderBy("title")
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }
}

module.exports = ProductCategoryController;

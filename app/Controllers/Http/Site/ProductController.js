/* eslint-disable no-return-await */
/* eslint-disable arrow-parens */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */

"use strict";

const Resource = use("App/Models/Product");
const ResourceProductCategory = use("App/Models/ProductCategory");

class ProductController {
  async index({ request }) {
    const req = request.all();
    const offset = req.offset ? parseInt(req.offset, 10) : 1;
    const limit = req.limit ? parseInt(req.limit, 10) : 12;
    const category = req.category ? req.category : null;
    const search = req.search ? req.search : null;

    let resources = Resource.query()
      .where("status", "published")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .with("inventories")
      .whereHas(
        "images",
        (builder) => {
          builder.where("id", ">", 0);
        },
        ">",
        0
      )
      .with("imageCover")
      .with("category")
      .orderBy("model");

    if (category !== null) {
      const searchCategory = decodeURIComponent(category);
      const findCategory = await ResourceProductCategory.findBy(
        "friendly_url",
        searchCategory
      );

      if (findCategory !== null)
        resources = resources.andWhere("category_id", findCategory.id);
      else resources = resources.andWhere("category_id", "###");
    }

    if (search !== null) {
      const searchVar = `%${decodeURIComponent(search)}%`;

      resources = resources.andWhere((builder) => {
        builder.where("model", "LIKE", searchVar);
        builder.orWhere("headline", "LIKE", searchVar);
        builder.with("category", (query) => {
          query.where("title", "LIKE", searchVar);
        });
      });
    }

    resources = await resources.paginate(offset, limit);

    return {
      data: {
        resources,
      },
    };
  }

  async getBestSellerProduct(ids) {
    const resources = await Resource.query()
      .where((builder) => {
        builder.where("status", "published");
        builder.whereIn("id", ids);
      })
      .with("category")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .with("inventories")
      .with("imageCover")
      .whereHas(
        "images",
        (builder) => {
          builder.where("id", ">", 0);
        },
        ">",
        0
      )
      .fetch();

    return resources;
  }

  async bestSeller({ request }) {
    const { ids } = request.all();
    let resources = [];

    if (ids.length > 0) {
      const filteredIds = ids.filter((el) => el !== "");
      resources = await this.getBestSellerProduct(filteredIds);
    }

    return {
      data: {
        resources,
      },
    };
  }

  async home() {
    const resources = await Resource.query()
      .where("status", "published")
      .with("category")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .with("inventories")
      .with("imageCover")
      .whereHas(
        "images",
        (builder) => {
          builder.where("id", ">", 0);
        },
        ">",
        0
      )
      .orderBy("model")
      .limit(8)
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }

  async related({ request }) {
    const { categoryId, exceptId } = request.all();

    const resources = await Resource.query()
      .where("category_id", categoryId)
      .andWhere("id", "!=", exceptId)
      .andWhere("status", "published")
      .with("category")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .with("inventories")
      .with("imageCover")
      .whereHas(
        "images",
        (builder) => {
          builder.where("id", ">", 0);
        },
        ">",
        0
      )
      .orderBy("created_at")
      .limit(10)
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }

  async show({ params }) {
    const id = params.name;

    const resource = await Resource.query()
      .with("category")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .with("inventories")
      .with("inventory")
      .with("imageCover")
      .with("images")
      .whereHas(
        "images",
        (builder) => {
          builder.where("id", ">", 0);
        },
        ">",
        0
      )
      .where("friendly_url", id)
      .first();

    return {
      data: {
        resource,
      },
    };
  }
}

module.exports = ProductController;

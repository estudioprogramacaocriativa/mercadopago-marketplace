"use strict";

const Resource = use("App/Models/ProductCategory");

class ProductCategoryController {
  async index({ request, response }) {
    const req = request.all();
    const offset = req.offset ? parseInt(req.offset, 10) : 1;
    const limit = req.limit ? parseInt(req.limit, 10) : 10;
    const except = req.except ? req.except : null;
    const search = req.search ? req.search : null;
    const paginate = req.paginate ? req.paginate : true;

    let resources = Resource.query().orderBy("created_at", "desc");
    if (except !== null) resources = resources.where("id", "!=", except);

    if (search !== null) {
      const searchVal = `%${decodeURIComponent(search)}%`;
      resources = resources.where("title", "like", searchVal);
    }

    if (paginate === "false") resources = await resources.fetch();
    else resources = await resources.paginate(offset, limit);

    return response.json({
      data: {
        resources,
      },
    });
  }

  async store({ request }) {
    const {
      title,
      friendlyUrl,
      categoryId,
      description,
      status,
      mediaId,
    } = request.all();

    const data = {
      media_id: mediaId,
      friendly_url: friendlyUrl,
      category_id: categoryId,
      description,
      title,
      status,
    };

    const create = await Resource.create(data);

    return {
      data: {
        create,
        message: `A categoria ${create.title} foi criada com sucesso!`,
      },
    };
  }

  async show({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "A categoria solicitada não foi encontrada!",
        },
      });
    }

    return {
      data: {
        resource,
      },
    };
  }

  async update({ params, request, response }) {
    const resource = await Resource.find(params.id);
    const {
      friendlyUrl,
      categoryId,
      description,
      title,
      status,
      mediaId,
    } = request.all();

    const data = {
      friendly_url: friendlyUrl,
      category_id: categoryId,
      media_id: mediaId,
      title,
      description,
      status,
    };

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "A categoria solicitada não foi encontrada!",
        },
      });
    }

    resource.merge(data);
    await resource.save();

    return {
      data: {
        resource,
        message: `A categoria ${resource.title} foi atualizada com sucesso!`,
      },
    };
  }

  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "A categoria solicitada não foi encontrado!",
        },
      });
    }

    await resource.delete();

    return {
      data: {
        message: "A categoria foi deletada permanentemente!",
      },
    };
  }
}

module.exports = ProductCategoryController;

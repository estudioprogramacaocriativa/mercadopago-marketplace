"use strict";

const Resource = use("App/Models/Slider");

class SliderController {
  async index({ request }) {
    const req = request.all();
    const offset = req.offset ? req.offset : 1;
    const limit = req.limit ? req.limit : 12;
    const paginate = req.paginate ? req.paginate : true;
    const search = req.search ? req.search : null;

    let resources = Resource.query()
      .orderBy("created_at")
      .with("product.imageCover")
      .with("category");

    if (search !== null) {
      const searchVal = `%${decodeURIComponent(search)}%`;
      resources = resources.where((builder) => {
        builder.where("title", "like", searchVal);
      });
    }

    if (paginate === "false") resources = await resources.fetch();
    else resources = await resources.paginate(offset, limit);

    return {
      data: {
        resources,
      },
    };
  }

  async store({ request }) {
    const {
      title,
      subtitle,
      hasLink,
      url,
      type,
      target,
      status,
      imageBig,
      imageSmall,
      productId,
      categoryId,
    } = request.all();

    const resource = await Resource.create({
      title,
      subtitle,
      url,
      target,
      type,
      status,
      has_link: hasLink,
      image_big: imageBig,
      image_small: imageSmall,
      product_id: productId,
      category_id: categoryId,
    });

    return {
      data: {
        message: "O slide foi inserido com sucess",
        resource,
      },
    };
  }

  async show({ params, response }) {
    const { id } = params;
    const resource = await Resource.query().where("id", id).first();

    if (!id || !resource)
      return response.status(404).json({
        data: {
          message: "Recurso não encontrado",
        },
      });

    return {
      data: {
        resource,
      },
    };
  }

  async update({ params, request, response }) {
    const { id } = params;
    const resource = await Resource.find(id);

    if (!id || !resource)
      return response.status(404).json({
        data: {
          message: "Recurso não encontrado",
        },
      });

    const {
      title,
      subtitle,
      hasLink,
      url,
      type,
      status,
      target,
      imageBig,
      imageSmall,
      productId,
      categoryId,
    } = request.all();

    resource.merge({
      title,
      subtitle,
      url,
      target,
      type,
      status,
      has_link: hasLink,
      image_big: imageBig,
      image_small: imageSmall,
      product_id: productId,
      category_id: categoryId,
    });
    await resource.save();

    return {
      data: {
        resource,
        message: `O slider ${title} foi atualizado com sucesso!`,
      },
    };
  }

  async destroy({ params, response }) {
    const { id } = params;
    const resource = await Resource.find(id);

    if (!id || !resource)
      return response.status(404).json({
        data: {
          message: "Não foi possível localizar o registro solicitado",
        },
      });

    try {
      await resource.delete();

      return {
        data: {
          message: "O slider foi removido com sucesso!",
        },
      };
    } catch (e) {
      return response.status(404).json({
        data: {
          message:
            "Nao foi possível remover o recurso. Por favor, tente novamente em alguns minutos.",
        },
      });
    }
  }
}

module.exports = SliderController;

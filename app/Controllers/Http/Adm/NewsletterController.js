"use strict";

const Resource = use("App/Models/Newsletter");

class NewsletterController {
  async index({ request, response }) {
    const req = request.all();
    const offset = req.offset ? parseInt(req.offset, 10) : 1;
    const limit = req.limit ? parseInt(req.limit, 10) : 10;
    const search = req.search ? req.search : null;
    const paginate = req.paginate ? req.paginate : true;

    try {
      let resources = Resource.query().orderBy("created_at", "desc");

      if (search !== null) {
        const searchVal = `%${decodeURIComponent(search)}%`;
        resources = resources.where("email", "like", searchVal);
      }

      if (paginate === "false") resources = await resources.fetch();
      else resources = await resources.paginate(offset, limit);

      return {
        data: {
          resources,
        },
      };
    } catch (e) {
      return response.json({
        data: {
          message: e.message,
        },
      });
    }
  }

  async store({ request, response }) {
    const { email } = request.all();

    try {
      const data = {
        email,
      };

      const resource = await Resource.create(data);

      return {
        data: {
          message: `O e-mail para newsletter ${resource.email} foi inserido com sucesso!`,
          resource,
        },
      };
    } catch (e) {
      return response.status(400).json({
        data: {
          message: e,
        },
      });
    }
  }

  async show({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail para newsletter solicitado não foi encontrado!",
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
    const { email } = request.all();
    const data = {
      email,
    };

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail para newsletter solicitado não foi encontrado!",
        },
      });
    }

    try {
      resource.merge(data);
      await resource.save(data);

      return {
        data: {
          resource,
          message: `O e-mail para newsletter ${resource.email} foi atualizado com sucesso.`,
        },
      };
    } catch (e) {
      return response.status(400).json({
        data: {
          message: e,
        },
      });
    }
  }

  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail para newsletter solicitado não foi encontrado!",
        },
      });
    }

    await resource.delete();

    return {
      data: {
        message: "O e-mail para newsletter foi deletado permanentemente!",
      },
    };
  }
}

module.exports = NewsletterController;

"use strict";

const Resource = use("App/Models/Contact");

class ContactController {
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
        resources = resources.orWhere("name", "like", searchVal);
        resources = resources.orWhere("subject", "like", searchVal);
        resources = resources.orWhere("phone", "like", searchVal);
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

  async show({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "A mensagem de contato solicitada não foi encontrado!",
        },
      });
    }

    resource.merge({
      status: "readed",
    });
    await resource.save();

    return {
      data: {
        resource,
      },
    };
  }

  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "A mensagem de contato solicitada não foi encontrado!",
        },
      });
    }

    await resource.delete();

    return {
      data: {
        message: "A mensagem de contato foi deletada permanentemente!",
      },
    };
  }
}

module.exports = ContactController;

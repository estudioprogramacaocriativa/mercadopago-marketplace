"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Resource = use("App/Models/ApplicationEmail");

/**
 * Resourceful controller for interacting with applicationemails
 */
class ApplicationEmailController {
  /**
   * Show a list of all applicationemails.
   * GET applicationemails
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
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

  /**
   * Create/save a new applicationemail.
   * POST applicationemails
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const { email } = request.all();

    try {
      const data = {
        email,
      };

      const resource = await Resource.create(data);

      return {
        data: {
          message: `O e-mail ${resource.email} foi inserido com sucesso!`,
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

  /**
   * Display a single applicationemail.
   * GET applicationemails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail solicitado não foi encontrado!",
        },
      });
    }

    return {
      data: {
        resource,
      },
    };
  }

  /**
   * Update applicationemail details.
   * PUT or PATCH applicationemails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const resource = await Resource.find(params.id);
    const { email } = request.all();

    const data = {
      email,
    };

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail solicitado não foi encontrado!",
        },
      });
    }

    try {
      resource.merge(data);
      await resource.save(data);

      return {
        data: {
          resource,
          message: `O e-mail ${resource.email} foi atualizado com sucesso.`,
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

  /**
   * Delete a applicationemail with id.
   * DELETE applicationemails/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O e-mail solicitado não foi encontrado!",
        },
      });
    }

    await resource.delete();

    return {
      data: {
        message: "O e-mail foi deletado permanentemente!",
      },
    };
  }
}

module.exports = ApplicationEmailController;

"use strict";

const Resource = use("App/Models/Coupon");

class CouponController {
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
        resources = resources
          .where("name", "like", searchVal)
          .orWhere("code", "like", searchVal);
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
    const {
      name,
      code,
      type,
      status,
      startDate,
      endDate,
      valueFix,
      valuePercent,
    } = request.all();

    let value;

    if (type === "fix") value = valueFix;
    else value = valuePercent;

    try {
      const data = {
        name,
        code,
        type,
        status,
        start_date: startDate,
        end_date: endDate,
        value,
      };

      const resource = await Resource.create(data);

      return {
        data: {
          message: `O cupom ${resource.name} foi inserido com sucesso!`,
          resource,
        },
      };
    } catch (e) {
      if (e.name === "RangeError") {
        return response.status(400).json({
          data: {
            message:
              "A uma das datas informada está incorreta! É necessário informar a data correta com o horário válido. Você pode informar apenas a data inicial ou final ou nenhuma das duas!",
          },
        });
      }

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
          message: "O cupom solicitado não foi encontrado!",
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
      name,
      code,
      type,
      status,
      startDate,
      endDate,
      valueFix,
      valuePercent,
    } = request.all();

    let value;

    if (type === "fix") value = valueFix;
    else value = valuePercent;

    const data = {
      name,
      code,
      type,
      status,
      start_date: startDate,
      end_date: endDate,
      value,
    };

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O cupom solicitado não foi encontrado!",
        },
      });
    }

    try {
      resource.merge(data);
      await resource.save(data);

      return {
        data: {
          resource,
          message: `O cupom ${resource.name} foi atualizado com sucesso.`,
        },
      };
    } catch (e) {
      if (e.name === "RangeError") {
        return response.status(400).json({
          data: {
            message:
              "A uma das datas informada está incorreta! É necessário informar a data correta com o horário válido. Você pode informar apenas a data inicial ou final ou nenhuma das duas!",
          },
        });
      }

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
          message: "O cupom solicitado não foi encontrado!",
        },
      });
    }

    await resource.delete();

    return {
      data: {
        message: "O cupom foi deletado permanentemente!",
      },
    };
  }
}

module.exports = CouponController;

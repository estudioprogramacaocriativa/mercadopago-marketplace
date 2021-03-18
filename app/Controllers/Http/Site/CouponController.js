"use strict";

const Resource = use("App/Models/Coupon");
const Helpers = use("App/Helpers");

class CouponController {
  async show({ request, response }) {
    const { coupon } = request.all();
    const find = await Resource.findBy("code", coupon);

    if (find === null) {
      return response.status(400).json({
        data: {
          message: "O código informado não é válido!",
        },
      });
    }

    const dateNow = Date.now();

    if (find.start_date !== null && find.start_date > dateNow) {
      const startIn = find.start_date.toLocaleDateString("pt-BR");
      const formatedDate = startIn.split("-").reverse().join("/");

      return response.status(400).json({
        data: {
          message: `Esse cupom só é válido à partir de ${formatedDate}`,
        },
      });
    }

    if (find.end_date !== null && find.end_date < dateNow) {
      const startIn = find.end_date.toLocaleDateString("pt-BR");
      const formatedDate = startIn.split("-").reverse().join("/");

      return response.status(400).json({
        data: {
          message: `Esse cupom expirou em ${formatedDate}`,
        },
      });
    }

    if (find.status !== "active") {
      return response.status(400).json({
        data: {
          message: "Esse cupom não está disponível para uso no momento!",
        },
      });
    }

    let message;

    if (find.type === "percent")
      message = `O cupom ${find.name} foi aplicado. Você recebeu ${find.value}% de desconto`;
    else
      message = `O cupom ${
        find.name
      } foi aplicado. Você recebeu ${Helpers.formatPrice(
        find.value
      )} reais de desconto`;

    return {
      data: {
        message,
        resource: {
          code: find.code,
          type: find.type,
          value: find.value,
        },
      },
    };
  }
}

module.exports = CouponController;

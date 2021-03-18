'use strict';

class Coupon {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id } = this.ctx.params;

    return {
      name: `required|unique:coupons,name,id,${id}`,
      code: `required|unique:coupons,code,id,${id}`,
      type: 'required',
      valueFix: 'required_when:type,fix',
      valuePercent: 'required_when:type,percent',
    };
  }

  get messages() {
    const translate = {
      name: 'nome',
      code: 'código',
      type: 'tipo',
      valueFix: 'valor fixo',
      valuePercent: 'valor percentual',
    };

    return {
      required: (field) => `O campo ${translate[field]} é obrigatório`,
      requiredWhen: (field) => `O campo ${translate[field]} é obrigatório`,
      'code.unique': 'O código informado não está disponível',
      'name.unique': 'O nome informado não está disponível',
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = Coupon;

'use strict';

class UserAddress {
  get validateAll() {
    return true;
  }

  get rules() {
    const { id, userId } = this.ctx.request._all;

    return {
      zipCode: `required|exists:user_addresses,zip_code,id,${id},user_id,${userId}`,
      name: `exists:user_addresses,name,id,${id},user_id,${userId}`,
      city: 'required',
      state: 'required',
      publicPlace: 'required',
      publicPlaceNumber: 'required|number',
      district: 'required',
    };
  }

  get messages() {
    const translate = {
      zipCode: 'CEP',
      name: 'identificador',
      city: 'cidade',
      state: 'estado',
      publicPlace: 'logradouro',
      publicPlaceNumber: 'número',
      district: 'bairro',
    };

    return {
      exists: field =>
        `Já existe um ${translate[field]} sendo utilizado com esse valor para sua conta!`,
      required: field => `O campo ${translate[field]} é obrigatório!`,
    };
  }

  async fails(message) {
    return this.ctx.response.status(402).json({
      data: message,
    });
  }
}

module.exports = UserAddress;

'use strict';

const Resource = use('App/Models/UserAddress');
const messageSuccess =
  'Os seus dados de endereço foram atualizados com sucesso!';

class UserAddressController {
  async store({ params, request }) {
    const { userId } = params;
    const {
      zipCode,
      name,
      publicPlace,
      publicPlaceNumber,
      district,
      city,
      state,
      complement,
    } = request.all();

    await Resource.create({
      user_id: userId,
      zip_code: zipCode,
      public_place: publicPlace,
      public_place_number: publicPlaceNumber,
      name,
      city,
      state,
      district,
      complement,
      main: 1,
    });

    return {
      data: {
        message: messageSuccess,
      },
    };
  }

  async update({ request, params }) {
    const { userId } = params;
    const {
      id,
      zipCode,
      name,
      publicPlace,
      publicPlaceNumber,
      district,
      city,
      state,
      complement,
    } = request.all();

    const address = await Resource.find(id);
    const data = {
      user_id: userId,
      zip_code: zipCode,
      public_place: publicPlace,
      public_place_number: publicPlaceNumber,
      name,
      city,
      state,
      district,
      complement,
      main: 1,
    };

    if (address) {
      address.merge(data);
      await address.save();
    } else {
      await Resource.create(data);
    }

    return {
      data: {
        message: messageSuccess,
      },
    };
  }
}

module.exports = UserAddressController;

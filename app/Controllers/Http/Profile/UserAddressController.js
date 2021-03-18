'use strict';

const Resource = use('App/Models/UserAddress');
const messageSuccess =
  'Os seus dados de endereço foram atualizados com sucesso!';
const messageFail =
  'Não foi possível identificar a sua conta. Por favor, atualize a página e tente novamente!';

class UserAddressController {
  async update({ request, response, auth }) {
    const authUser = await auth.getUser();
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
    const userAddress = await Resource.findBy('user_id', authUser.id);

    if (!authUser) {
      return response.status(401).json({
        data: {
          message: messageFail,
        },
      });
    }

    const data = {
      zip_code: zipCode,
      public_place: publicPlace,
      public_place_number: publicPlaceNumber,
      name,
      city,
      state,
      district,
      complement,
    };

    if (userAddress) {
      userAddress.merge(data);
      await userAddress.save();
    } else {
      data.user_id = authUser.id;
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

'use strict';

const Resource = use('App/Models/UserAddress');
const UserAddress = use('App/Models/UserAddress');

class UserAddressController {
  async index({ auth, response, params }) {
    const loggedUser = await auth.getUser();
    const { userId } = params;

    if (!userId || parseInt(loggedUser.id, 10) !== parseInt(userId, 10)) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o id do usuário!',
        },
      });
    }

    if (!loggedUser) {
      return response.status(400).json({
        data: {
          message: 'Você precisa estar logado para realizar esta ação!',
        },
      });
    }

    const resources = await loggedUser
      .addresses()
      .orderBy([
        {
          column: 'main',
          order: 'desc',
        },
        {
          column: 'name',
          order: 'asc',
        },
      ])
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }

  async show({ auth, params, response }) {
    const { id } = params;
    const loggedUser = await auth.getUser();

    if (!loggedUser) {
      return response.status(400).json({
        data: {
          message: 'Você precisa estar logado para realizar esta ação!',
        },
      });
    }

    const resource = await Resource.find(id);

    if (!resource) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o endereço solicitado!',
        },
      });
    }

    if (parseInt(resource.user_id, 10) !== parseInt(loggedUser.id, 10)) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o endereço solicitado!',
        },
      });
    }

    return {
      data: {
        resource: {
          city: resource.city,
          complement: resource.complement,
          district: resource.district,
          id: resource.id,
          main: resource.main,
          name: resource.name,
          public_place: resource.public_place,
          public_place_number: resource.public_place_number,
          state: resource.state,
          zip_code: resource.zip_code,
        },
      },
    };
  }

  async store({ auth, request, response, params }) {
    const loggedUser = await auth.getUser();
    const { userId } = params;

    if (!userId || parseInt(loggedUser.id, 10) !== parseInt(userId, 10)) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o id do usuário!',
        },
      });
    }

    if (!loggedUser) {
      return response.status(400).json({
        data: {
          message: 'Você precisa estar logado para realizar esta ação!',
        },
      });
    }

    const {
      name,
      zipCode,
      publicPlaceNumber,
      publicPlace,
      district,
      city,
      state,
      complement,
      main,
    } = request.all();

    if (main) {
      await UserAddress.query().where('main', 1).update({
        main: 0,
      });
    }

    await Resource.create({
      user_id: loggedUser.id,
      name,
      zip_code: zipCode,
      public_place_number: publicPlaceNumber,
      public_place: publicPlace,
      district,
      city,
      state,
      complement,
      main,
    });

    return response.status(201).json({
      data: {
        message: 'O novo endereço foi adicionado à sua conta!',
      },
    });
  }

  async update({ auth, params, request, response }) {
    const loggedUser = await auth.getUser();
    const { id, userId } = params;

    if (!userId || parseInt(loggedUser.id, 10) !== parseInt(userId, 10)) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o id do usuário!',
        },
      });
    }

    if (!id) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o registro à ser alterado!',
        },
      });
    }

    if (!loggedUser) {
      return response.status(400).json({
        data: {
          message: 'Você precisa estar logado para realizar esta ação!',
        },
      });
    }

    const {
      name,
      zipCode,
      publicPlaceNumber,
      publicPlace,
      district,
      city,
      state,
      complement,
      main,
    } = request.all();

    const resource = await Resource.find(id);

    if (main) {
      await UserAddress.query().where('main', 1).update({
        main: 0,
      });
    }

    resource.merge({
      name,
      zip_code: zipCode,
      public_place_number: publicPlaceNumber,
      public_place: publicPlace,
      district,
      city,
      state,
      complement,
      main,
    });

    await resource.save();

    return {
      data: {
        resource,
        message: 'O endereço foi atualizado!',
      },
    };
  }

  async destroy({ auth, params, response }) {
    const loggedUser = await auth.getUser();
    const { id, userId } = params;

    if (!userId || parseInt(loggedUser.id, 10) !== parseInt(userId, 10)) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o id do usuário!',
        },
      });
    }

    if (!id) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o registro à ser excluído!',
        },
      });
    }

    if (!loggedUser) {
      return response.status(400).json({
        data: {
          message: 'Você precisa estar logado para realizar esta ação!',
        },
      });
    }

    const userAddress = await UserAddress.find(id);

    if (!userAddress) {
      return response.status(400).json({
        data: {
          message: 'Não foi possível identificar o registro à ser excluído!',
        },
      });
    }

    if (userAddress.main) {
      return response.status(400).json({
        data: {
          message:
            'Você não pode excluir o endereço principal! Marque outro endereço como principal para pode excluir este',
        },
      });
    }

    const userAddresses = await UserAddress.query()
      .where('user_id', userId)
      .fetch();

    const totalRows = userAddresses.rows.length;

    if (totalRows <= 1) {
      return response.status(400).json({
        data: {
          message: 'Você não pode excluir o único endereço cadastrado!',
        },
      });
    }

    await userAddress.delete();

    return {
      data: {
        message: 'O endereço selecionado foi removido com sucesso!',
      },
    };
  }
}

module.exports = UserAddressController;

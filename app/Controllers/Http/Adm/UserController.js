"use strict";

const Event = use("Event");
const Resource = use("App/Models/User");
const ResourceAddress = use("App/Models/UserAddress");
const ResourceFile = use("App/Models/UserFile");
const ResourceShareProfile = use("App/Models/MarketplaceReseler");
const notFound = "O usuário solicitado não foi encontrado!";

class UserController {
  async index({ request, auth }) {
    const req = request.all();
    const limit = req.limit ? req.limit : 10;
    const offset = req.offset ? req.offset : 1;
    const role = req.role ? req.role : null;
    const paginate = req.paginate ? req.paginate : true;
    const currentUser = await auth.getUser();
    const search = req.search ? req.search : null;
    const reselerId = req.reselerId ? req.reselerId : null;

    let resources = Resource.query()
      .orderBy("created_at", "desc")
      .with("addresses")
      .with("files")
      .with("orders", (builder) => {
        builder.orderBy("created_at", "desc");
      });

    if (role !== null) resources.where("role", role);

    if (role !== null && role === "reseler") {
      resources.with("clients");
    }

    if (reselerId !== null) {
      resources.where("user_id", parseInt(reselerId, 10));
    }

    if (search !== null) {
      const searchVal = `%${decodeURIComponent(search)}%`;
      resources = resources.where((builder) => {
        builder
          .where("name", "like", searchVal)
          .orWhere("email", "like", searchVal)
          .orWhere("phone", "like", searchVal)
          .orWhere("cpf", "like", searchVal)
          .orWhere("last_name", "like", searchVal);

        if (role !== null) builder.andWhere("role", role);
      });
    }

    if (paginate !== "false") {
      resources = await resources
        .where("id", "!=", currentUser.id)
        .paginate(offset, limit);
    } else resources = await resources.fetch();

    return {
      data: {
        resources,
      },
    };
  }

  async store({ request }) {
    const {
      password: showPassword,
      password,
      name,
      nickname,
      lastName,
      email,
      cpf,
      birthDate,
      phone,
      status,
      mediaId,
      addressName,
      zipCode,
      publicPlaceNumber,
      publicPlace,
      district,
      city,
      state,
      complement,
      document,
      selfieFace,
      selfieDocument,
      terms,
      statusDocuments,
      documentStatus,
      selfieDocumentStatus,
      selfieFaceStatus,
      termsStatus,
      userId,
      firstAccessHash,
      activationCode,
      role,
    } = request.all();

    try {
      const user = await Resource.create({
        name,
        email,
        password,
        role,
        status,
        cpf,
        nickname,
        phone,
        user_id: userId,
        last_name: lastName,
        birth_date: birthDate,
        first_access_hash: firstAccessHash,
        activation_code: activationCode,
        media_id: mediaId,
      });

      Event.fire("user::register", user, showPassword);

      if (role !== "master") {
        await user.address().create({
          name: addressName,
          zip_code: zipCode,
          public_place_number: publicPlaceNumber,
          public_place: publicPlace,
          district,
          city,
          state,
          complement,
        });
      }

      if (role === "reseler") {
        await user.files().create({
          document_media_id: document,
          selfie_face_media_id: selfieFace,
          selfie_document_media_id: selfieDocument,
          terms_media_id: terms,
          document_status: documentStatus,
          selfie_face_status: selfieFaceStatus,
          selfie_document_status: selfieDocumentStatus,
          terms_status: termsStatus,
          status: statusDocuments,
        });
      }

      return {
        data: {
          resource: user,
          message: "O usuário foi criado. Um e-mail foi enviado",
        },
      };
    } catch (e) {
      return {
        data: {
          message: `Não foi possível criar o usuário no momento. Motivo: ${e.message}`,
        },
      };
    }
  }

  async show({ params, response }) {
    const resource = await Resource.query()
      .select(
        "id",
        "user_id",
        "email",
        "name",
        "last_name",
        "birth_date",
        "phone",
        "media_id",
        "nickname",
        "cpf",
        "status",
        "role",
        "block_reason",
        "first_access_hash"
      )
      .where("id", params.id)
      .with("address")
      .with("files")
      .with("shareProfile")
      .first();

    if (!resource) {
      return response.status(404).json({
        data: {
          message: notFound,
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
    const user = await Resource.find(params.id);
    const {
      password,
      name,
      lastName,
      nickname,
      email,
      cpf,
      birthDate,
      blockReason,
      phone,
      status,
      mediaId,
      addressName,
      zipCode,
      publicPlaceNumber,
      publicPlace,
      district,
      city,
      state,
      complement,
      document,
      selfieFace,
      selfieDocument,
      terms,
      statusDocuments,
      documentStatus,
      selfieDocumentStatus,
      selfieFaceStatus,
      termsStatus,
    } = request.all();

    if (!user) {
      return response.status(404).json({
        data: {
          message: notFound,
        },
      });
    }

    const shareProfile = await user.shareProfile().fetch();

    if (
      shareProfile === null &&
      user.status !== "active" &&
      status === "active"
    ) {
      const shareProfileModel = new ResourceShareProfile();
      shareProfileModel.user_id = user.id;
      shareProfileModel.share_profile_hash = user.nickname;

      await shareProfileModel.save();

      Event.fire("user::notifyReseler", user);
    }

    if (user.status !== "blocked" && status === "blocked")
      Event.fire("user::notifyBlockedAccount", user);

    user.merge({
      name,
      phone,
      email,
      nickname,
      cpf,
      status,
      last_name: lastName,
      birth_date: birthDate,
      media_id: mediaId,
      block_reason: blockReason,
    });

    if (password !== null) {
      user.merge({
        password,
      });
    }

    await user.save();

    const address = await user.address().fetch();
    const files = await user.files().fetch();

    if (address === null) {
      const addressModel = new ResourceAddress();
      addressModel.name = addressName;
      addressModel.zip_code = zipCode;
      addressModel.public_place_number = publicPlaceNumber;
      addressModel.public_place = publicPlace;
      addressModel.district = district;
      addressModel.city = city;
      addressModel.state = state;
      addressModel.complement = complement;

      await user.address().save(addressModel);
    } else {
      address.merge({
        name: addressName,
        zip_code: zipCode,
        public_place_number: publicPlaceNumber,
        public_place: publicPlace,
        district,
        city,
        state,
        complement,
      });

      await address.save();
    }

    if (files === null) {
      const filesModel = new ResourceFile();
      filesModel.document_media_id = document;
      filesModel.selfie_face_media_id = selfieFace;
      filesModel.selfie_document_media_id = selfieDocument;
      filesModel.terms_media_id = terms;
      filesModel.document_status = documentStatus;
      filesModel.selfie_face_status = selfieFaceStatus;
      filesModel.selfie_document_status = selfieDocumentStatus;
      filesModel.terms_status = termsStatus;
      filesModel.status = statusDocuments;

      await user.files().save(filesModel);
    } else {
      files.merge({
        document_media_id: document,
        selfie_face_media_id: selfieFace,
        selfie_document_media_id: selfieDocument,
        terms_media_id: terms,
        document_status: documentStatus,
        selfie_face_status: selfieFaceStatus,
        selfie_document_status: selfieDocumentStatus,
        terms_status: termsStatus,
        status: statusDocuments,
      });

      await files.save();
    }

    return {
      data: {
        resource: user,
        message: `Os dados do usuário ${user.name} foram atualizados com sucesso!`,
      },
    };
  }

  async destroy({ params, response }) {
    const user = await Resource.find(params.id);

    if (!user) {
      return response.status(404).json({
        data: {
          message: notFound,
        },
      });
    }

    try {
      await user.tokens().delete();
      await user.addresses().delete();
      await user.files().delete();
      await user.delete();

      return {
        data: {
          message: "O usuário selecionado foi permanentemente deletado!",
        },
      };
    } catch (e) {
      return {
        data: {
          message: `Não foi possível remover o usuário no momento. Motivo: ${e.message}`,
        },
      };
    }
  }
}

module.exports = UserController;

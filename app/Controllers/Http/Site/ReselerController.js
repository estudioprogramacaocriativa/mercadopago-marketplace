/* eslint-disable arrow-parens */

"use strict";

const Resource = use("App/Models/UserReseler");
const ResourceFile = use("App/Models/UserFile");
const ResourceAddress = use("App/Models/UserAddress");
const Media = use("App/Models/Media");
const Helpers = use("Helpers");
const Event = use("Event");

class ReselerController {
  async store({ request }) {
    const {
      name,
      lastName,
      birthDate,
      email,
      cpf,
      phone,
      zipCode,
      state,
      city,
      district,
      publicPlace,
      publicPlaceNumber,
      role,
    } = request.all();

    const user = await Resource.create({
      name,
      email,
      cpf,
      phone,
      role,
      last_name: lastName,
      birth_date: birthDate,
    });

    await ResourceAddress.create({
      state,
      city,
      district,
      user_id: user.id,
      zip_code: zipCode,
      public_place: publicPlace,
      public_place_number: publicPlaceNumber,
    });

    const { picFile, docFile, picDocFile, termFile } = request.files(
      "picFile",
      "docFile",
      "picDocFile",
      "termFile"
    );

    const documentMediaId = await this.storeFile(docFile, user);
    const selfieFaceMediaId = await this.storeFile(picFile, user);
    const selfieDocumentMediaId = await this.storeFile(picDocFile, user);
    const termsMediaId = await this.storeFile(termFile, user);

    const documentData = {
      user_id: user.id,
      document_media_id: documentMediaId.id,
      selfie_face_media_id: selfieFaceMediaId.id,
      selfie_document_media_id: selfieDocumentMediaId.id,
      terms_media_id: termsMediaId.id,
      document_status: "in_analisy",
      selfie_face_status: "in_analisy",
      selfie_document_status: "in_analisy",
      terms_status: "in_analisy",
      status: "in_analisy",
    };

    await ResourceFile.create(documentData);

    Event.fire("user::register", user);
    Event.fire("user::notify", user);

    return {
      data: {
        message: `Agradecemos o seu interesse em se tornar revendedor(a) dos nossos produtos ${user.name}. Iremos analisar suas informações e retornaremos em breve com uma resposta no seu e-mail cadastrado.`,
      },
    };
  }

  async storeFile(resource, user) {
    const fileName = resource.clientName;
    const filePath = `${Date.now()}-${resource.clientName}`;
    const extension = resource.extname;
    const { size } = resource;

    await resource.move(Helpers.publicPath("medias"), {
      name: filePath,
    });

    const item = await Media.create({
      name: fileName,
      path: filePath,
      extension,
      size,
      user_id: user.id,
    });

    return item;
  }
}

module.exports = ReselerController;

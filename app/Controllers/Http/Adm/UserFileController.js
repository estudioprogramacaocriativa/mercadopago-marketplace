"use strict";

const Resource = use("App/Models/UserFile");
const messageSuccess = "Os seus arquivos foram enviados com sucesso!";

class UserFileController {
  async store({ params, request }) {
    const { userId } = params;
    const {
      document,
      selfieFace,
      selfieDocument,
      terms,
      documentStatus,
      selfieDocumentStatus,
      selfieFaceStatus,
      termsStatus,
      status,
    } = request.all();

    await Resource.create({
      user_id: userId,
      document_media_id: document,
      selfie_face_media_id: selfieFace,
      selfie_document_media_id: selfieDocument,
      terms_media_id: terms,
      document_status: documentStatus,
      selfie_document_status: selfieDocumentStatus,
      selfie_face_status: selfieFaceStatus,
      terms_status: termsStatus,
      status,
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
      document,
      selfieFace,
      selfieDocument,
      terms,
      documentStatus,
      selfieDocumentStatus,
      selfieFaceStatus,
      termsStatus,
      status,
    } = request.all();
    const userFiles = await Resource.findBy("user_id", userId);

    if (!userFiles) {
      await Resource.create({
        user_id: userId,
        document_media_id: document,
        selfie_face_media_id: selfieFace,
        selfie_document_media_id: selfieDocument,
        terms_media_id: terms,
        document_status: documentStatus,
        selfie_document_status: selfieDocumentStatus,
        selfie_face_status: selfieFaceStatus,
        terms_status: termsStatus,
        status,
      });
    } else {
      userFiles.merge({
        document_media_id: document,
        selfie_face_media_id: selfieFace,
        selfie_document_media_id: selfieDocument,
        terms_media_id: terms,
        document_status: documentStatus,
        selfie_document_status: selfieDocumentStatus,
        selfie_face_status: selfieFaceStatus,
        terms_status: termsStatus,
        status,
      });

      await userFiles.save();
    }

    return {
      data: {
        message: "Os documentos foram atualizados com sucesso!",
      },
    };
  }
}

module.exports = UserFileController;

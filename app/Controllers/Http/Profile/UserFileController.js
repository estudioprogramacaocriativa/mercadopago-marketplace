"use strict";

const Resource = use("App/Models/UserFile");
const messageFail =
  "Não foi possível identificar a sua conta. Por favor, atualize a página e tente novamente!";

class UserFileController {
  async update({ request, response, auth }) {
    const authUser = await auth.getUser();
    const { document, selfieFace, selfieDocument, terms } = request.all();

    if (!authUser) {
      return response.status(401).json({
        data: {
          message: messageFail,
        },
      });
    }

    const userFiles = await Resource.findBy("user_id", authUser.id);

    if (!userFiles) {
      await Resource.create({
        user_id: authUser.id,
        document_media_id: document,
        selfie_face_media_id: selfieFace,
        selfie_document_media_id: selfieDocument,
        terms_media_id: terms,
        document_status: "in_analisy",
        selfie_document_status: "in_analisy",
        selfie_face_status: "in_analisy",
        terms_status: "in_analisy",
        status: "in_analisy",
      });
    } else {
      userFiles.merge({
        document_media_id: document,
        selfie_face_media_id: selfieFace,
        selfie_document_media_id: selfieDocument,
        terms_media_id: terms,
        document_status: "in_analisy",
        selfie_document_status: "in_analisy",
        selfie_face_status: "in_analisy",
        terms_status: "in_analisy",
        status: "in_analisy",
      });

      await userFiles.save();
    }

    return {
      data: {
        message: "Obrigado por enviar seus documentos!",
      },
    };
  }
}

module.exports = UserFileController;

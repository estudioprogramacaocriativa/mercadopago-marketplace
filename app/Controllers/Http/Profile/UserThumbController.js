"use strict";

const Resource = use("App/Models/User");
const Media = use("App/Models/Media");
const Helpers = use("Helpers");
const messageFail =
  "Não foi possível identificar a sua conta. Por favor, atualize a página e tente novamente!";

class UserThumbController {
  async update({ request, response, auth }) {
    const authUser = await auth.getUser();
    const { mediaId, isFile } = request.all();
    const { avatar } = request.files("avatar", {
      types: ["image"],
    });

    if (!authUser) {
      return response.status(401).json({
        data: {
          message: messageFail,
        },
      });
    }

    if (isFile) {
      const media = await this.storeFile(avatar, authUser);

      await Resource.query().where("id", authUser.id).update({
        media_id: media.id,
      });
    } else {
      await Resource.query().where("id", authUser.id).update({
        media_id: mediaId,
      });
    }

    return {
      data: {
        message: "Sua imagem de perfil foi atualizada com sucesso!",
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

module.exports = UserThumbController;

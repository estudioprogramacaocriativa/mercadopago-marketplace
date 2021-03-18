/* eslint-disable array-callback-return */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */

"use strict";

const Drive = use("Drive");
const Medias = use("App/Models/Media");
const Helpers = use("Helpers");
const fs = require("fs");

class MediaController {
  async index({ request, auth }) {
    const offset = request.all().offset ? request.all().offset : 1;
    const limit = request.all().limit ? request.all().limit : 12;
    const search = request.all().search ? request.all().search : null;
    const user = await auth.getUser();

    let resources = Medias.query()
      .orderBy("created_at", "desc");

    if (search !== null) {
      const searchVal = `%${decodeURIComponent(search)}%`;
      resources = resources.where("alt", "like", searchVal)
        .orWhere("title", "like", searchVal)
        .orWhere("name", "like", searchVal);
    }

    if(user.role === 'reseler') resources = resources.where('user_id', user.id);

    resources = await resources.paginate(offset, limit);

    return {
      data: {
        resources,
      },
    };
  }

  async getGallery({ request }) {
    const { type, userId } = request.all();

    let medias = Medias.query()
      .where("status", "published")
      .orderBy("created_at", "desc");

    if (type) medias = medias.where("type", type);
    if (userId) medias = medias.where("user_id", userId);

    medias = await medias.fetch();

    return {
      success: true,
      data: {
        resources: medias,
      },
    };
  }

  async store({ request, response }) {
    const { userId } = request.all();
    const images = request.file("medias");

    if (!images) {
      return response.status(403).json({
        data: {
          message:
            "Informe ao menos uma mídia: imagem, arquivos, vídeo, música, " +
            "etc... para realizar o upload do arquivo para a galeria",
        },
      });
    }

    await images.moveAll(Helpers.publicPath("medias"), file => ({
      name: `${Date.now()}-${file.clientName}`,
    }));

    if (!images.movedAll()) {
      return response.status(401).send({
        success: false,
        data: {
          message: images.errors(),
        },
      });
    }

    const theUserId = userId !== "undefined" ? userId : null;

    await Promise.all(
      images.movedList().map((media) => {
        Medias.create({
          user_id: theUserId,
          name: media.clientName,
          path: media.fileName,
          type: media.type,
          size: media.size,
          extension: media.extname,
        });
      })
    );

    return {
      data: {
        message:
          "As mídias selecionadas foram enviadas para a biblioteca do sistema",
      },
    };
  }

  async show({ params, response, auth }) {
    const { id } = params;
    const media = await Medias.find(id);

    if (!id || !media) {
      return response.status(404).json({
        data: {
          message: "O recurso solicitado não foi encontrado!",
        },
      });
    }

    const user = await auth.getUser();

    if(user.role === 'reseler' && media.user_id !== user.id) {
      return response.status(403).json({
        data: {
          message: 'Você não pode acessar esse registro!'
        }
      });
    }

    return {
      data: {
        resource: media,
      },
    };
  }

  async showMedia({ params, response, request }) {
    let find;
    let { id } = request.all();
    let { path } = params;

    if (typeof id !== "undefined" || Number.isInteger(parseInt(path, 10))) {
      if (Number.isInteger(parseInt(path, 10))) {
        id = parseInt(path, 10);
      }

      find = await Medias.find(id);
      path = find !== null ? find.path : path;
    }

    const exists = await Drive.exists(`medias/${path}`);

    if (!exists)
      return response.download(Helpers.publicPath(`images/no-image.png`));

    return response.download(Helpers.publicPath(`medias/${path}`));
  }

  async update({ params, request, response }) {
    const { id } = params;
    const media = await Medias.find(id);
    const data = request.only(["title", "alt", "status"]);

    if (!id || !media) {
      return response.status(404).json({
        data: {
          message:
            "Você tentou editar um registro que não existe ou foi removido " +
            "recentemente do sistema.",
        },
      });
    }

    media.merge(data);
    await media.save();

    return {
      success: true,
      data: {
        message: "A mídia foi atualizada",
      },
    };
  }

  async updateAll({ params, request }) {
    const requestAll = request.all();
    const { status } = params;
    let find;

    for (const id in requestAll) {
      find = Medias.query().where("id", requestAll[id]);

      try {
        await find.update({
          status,
        });
      } catch (e) {
        console.log(e.message);
      }
    }

    const trans = {
      published: "publicadas",
      draft: "definidas como rascunho",
      trash: "movidas para a lixera",
    };

    return {
      data: {
        message: `As mídias selecionadas foram <b>${trans[status]}</b>`,
      },
    };
  }

  async destroy({ params, response }) {
    const media = await Medias.find(params.id);

    if (media === null) {
      return response.status(404).json({
        data: {
          message:
            "Você tentou remover um registro que não existe ou foi removido " +
            "recentemente do sistema.",
        },
      });
    }

    try {
      const pathToFile = Helpers.publicPath(`medias/${media.path}`);
      const exists = await Drive.exists(pathToFile);

      if (exists) fs.unlink(pathToFile, () => {});

      await media.delete();

      return {
        success: true,
        data: {
          message: `A mídia selecionada foi removida!`,
        },
      };
    } catch (e) {
      return response.status(403).json({
        data: {
          message:
            "Não foi possível remover essa mídia. Verifique se ela não está " +
            "sendo utilizado em outro local por outro módulo do sistema.",
        },
      });
    }
  }

  async destroyAll({ request }) {
    const requestAll = request.all();
    let exists;
    let media;
    let pathToFile;
    let resource;
    const deletedResources = [];
    const unDeletedResources = [];
    let message = "";

    for (const id in requestAll) {
      media = await Medias.find(requestAll[id]);

      try {
        pathToFile = Helpers.publicPath(`medias/${media.path}`);
        exists = await Drive.exists(pathToFile);

        if (exists) fs.unlink(pathToFile, () => {});

        if (exists) fs.unlink(pathToFile, () => {});

        resource = media.path;
        await media.delete();
        deletedResources.push(resource);
      } catch (e) {
        unDeletedResources.push(media.path);
      }
    }

    if (deletedResources.length > 0) {
      message += `As  mídias selecionadas foram removidas com sucesso!`;
    }

    if (unDeletedResources.length > 0) {
      message += "Por estarem em uso em outros módulos da plataforma, " +
      "algumas mídias não puderam ser removidas!";
    }

    return {
      data: {
        message,
      },
    };
  }
}

module.exports = MediaController;

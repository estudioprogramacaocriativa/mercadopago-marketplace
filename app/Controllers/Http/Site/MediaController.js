'use strict';

const Drive = use('Drive');
const Media = use('App/Models/Media');
const Helpers = use('Helpers');

class MediaController {
  async show({ params, response, request }) {
    let { id } = request.all();
    let { path } = params;
    let defaultImage = await Helpers.publicPath(`images/no-image.png`);

    const { defaultImg } = request.all();

    const existsDefault = await Drive.exists(
      Helpers.publicPath(`images/${defaultImg}`)
    );

    if (defaultImg && existsDefault) {
      defaultImage = Helpers.publicPath(`images/${defaultImg}`);
    }

    if (typeof id !== 'undefined' || Number.isInteger(parseInt(path, 10))) {
      if (Number.isInteger(parseInt(path, 10))) {
        id = parseInt(path, 10);
      }

      const find = await Media.find(id);
      path = find !== null ? find.path : path;
    }

    const exists = await Drive.exists(Helpers.publicPath(`medias/${path}`));

    if (!exists) return response.download(defaultImage);

    return response.download(Helpers.publicPath(`medias/${path}`));
  }

  async getPath({ params, response }) {
    const { id } = params;
    const media = await Media.find(id);

    if (!media) {
      return response.status(404).json({
        data: {
          message: 'Não foi possível localizar o registro solicitado!',
        },
      });
    }

    return {
      data: {
        resource: {
          name: media.name,
          path: media.path,
          title: media.title,
          alt: media.alt,
          extension: media.extension,
          size: media.size,
          type: media.type,
          status: media.status,
        },
      },
    };
  }
}

module.exports = MediaController;

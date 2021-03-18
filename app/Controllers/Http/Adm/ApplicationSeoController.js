'use strict';

const Resource = use('App/Models/ApplicationSeo');

class ApplicationSeoController {
  async show() {
    const resource = await Resource.query().first();

    let payload = null;

    if (resource) {
      payload = {
        title: resource.title,
        description: resource.description,
        media_id: resource.media_id,
      };
    }

    return {
      data: {
        resource: payload,
      },
    };
  }

  async update({ request }) {
    const { title, description, mediaId } = request.all();
    const find = await Resource.query().first();

    const data = {
      title,
      description,
      media_id: mediaId,
    };

    if (find) {
      find.merge(data);
      await find.save();
    } else await Resource.create(data);

    return {
      data: {
        message: 'As configurações de SEO foram atualizadas!',
      },
    };
  }
}

module.exports = ApplicationSeoController;

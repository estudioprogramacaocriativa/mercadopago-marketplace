"use strict";

const Resource = use("App/Models/Newsletter");
const Event = use("Event");

class NewsletterController {
  async store({ request, response }) {
    const { email } = request.all();
    const newsletter = await Resource.create({
      email,
    });

    Event.fire("newsletter::store", newsletter);
    Event.fire("newsletter::notify", newsletter);

    return response.status(201).json({
      data: {
        message:
          "Você foi cadastrado com sucesso em nosso boletim de atualizações",
      },
    });
  }
}

module.exports = NewsletterController;

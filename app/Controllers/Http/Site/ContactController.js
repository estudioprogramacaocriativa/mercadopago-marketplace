"use strict";

const Resource = use("App/Models/Contact");
const Event = use("Event");

class ContactController {
  async store({ request, response }) {
    const { name, email, phone, subject, message } = request.all();
    const contact = await Resource.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    Event.fire("contact::store", contact);
    Event.fire("contact::notify", contact);

    return response.status(201).json({
      data: {
        message:
          "Sua mensagem foi encaminhada com sucesso ao setor responsável. Retornaremos o mais breve possível!",
      },
    });
  }
}

module.exports = ContactController;

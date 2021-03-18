"use strict";

const MPPayment = use("App/Services/Mercadopago/Payment");

class PaymentController {
  async index() {
    const resources = await MPPayment.search();

    return resources;
  }

  async store({ request }) {
    const req = request.all();

    const customer = await MPPayment.create(req);

    return customer;
  }

  async show({ params }) {}

  async update({ request, params }) {}
}

module.exports = PaymentController;

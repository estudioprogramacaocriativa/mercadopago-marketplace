"use strict";

const MPCustomer = use("App/Services/Mercadopago/Customer");

class CustomerController {
  async store({ request }) {
    const req = request.all();

    const customer = await MPCustomer.create(req);

    return customer;
  }

  async update({ request }) {
    const req = request.all();

    const customer = await MPCustomer.update(req);

    return customer;
  }

  async delete({ params }) {
    const { id } = params;
    const customer = await MPCustomer.delete(id);

    return customer;
  }
}

module.exports = CustomerController;

"use strict";

const Layout = use("App/Models/Layout");

class LayoutController {
  async show({ request }) {
    const { page } = request.all();

    const resource = await Layout.query().where("page", page).first();

    return {
      data: {
        resource,
      },
    };
  }
}

module.exports = LayoutController;

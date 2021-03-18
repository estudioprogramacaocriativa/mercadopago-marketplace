"use strict";

const Layout = use("App/Models/Layout");

class LayoutController {
  async index() {
    const layout = await Layout.query().orderBy("page").fetch();

    return {
      success: true,
      data: {
        resource: layout,
      },
    };
  }

  async show({ request }) {
    const page = await Layout.query().where("page", request.all().page).first();

    return {
      success: true,
      data: {
        resource: page,
      },
    };
  }

  async update({ request }) {
    const data = request.only(["page", "content"]);
    const check = await Layout.query().where("page", data.page).first();

    if (check === null || check === undefined) {
      Layout.create({
        page: data.page,
        content: JSON.stringify(data.content),
      });

      return {
        success: true,
        data: {
          message: `Conteúdo da página inserido`,
        },
      };
    }

    check.merge({
      page: data.page,
      content: JSON.stringify(data.content),
    });
    await check.save();

    return {
      success: true,
      data: {
        message: `Conteúdo da página atualizado`,
      },
    };
  }
}

module.exports = LayoutController;

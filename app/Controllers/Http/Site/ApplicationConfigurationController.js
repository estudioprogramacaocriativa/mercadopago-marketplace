"use strict";

const Resource = use("App/Models/ApplicationConfiguration");

class ApplicationConfigurationController {
  async show() {
    const resource = await Resource.query().with("email").first();

    return {
      data: {
        resource,
      },
    };
  }
}

module.exports = ApplicationConfigurationController;

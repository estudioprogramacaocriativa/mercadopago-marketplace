"use strict";

const Resource = use("App/Models/Slider");

class SlideController {
  async index() {
    const resources = await Resource.query()
      .where("status", "active")
      .with("product.imageCover")
      .with("product.category")
      .with("product.firstGalleryImage")
      .with("category")
      .orderBy("updated_at")
      .fetch();

    return {
      data: {
        resources,
      },
    };
  }
}

module.exports = SlideController;

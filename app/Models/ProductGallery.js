"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProductGallery extends Model {
  media() {
    return this.hasOne("App/Models/Media", "id", "media_id");
  }
}

module.exports = ProductGallery;

"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Slider extends Model {
  product() {
    return this.hasOne("App/Models/Product", "product_id", "id");
  }

  category() {
    return this.hasOne("App/Models/ProductCategory", "category_id", "id");
  }
}

module.exports = Slider;

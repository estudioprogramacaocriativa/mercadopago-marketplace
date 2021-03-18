"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProductColor extends Model {
  inventory() {
    return this.hasOne("App/Models/ProductInventory", "id", "color_id");
  }
}

module.exports = ProductColor;

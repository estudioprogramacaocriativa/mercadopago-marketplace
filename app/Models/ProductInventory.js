"use strict";

const Model = use("Model");

class ProductInventory extends Model {
  product() {
    return this.hasOne("App/Models/Product", "product_id", "id");
  }

  size() {
    return this.hasOne("App/Models/ProductSize", "size_id", "id");
  }

  color() {
    return this.hasOne("App/Models/ProductColor", "color_id", "id");
  }
}

module.exports = ProductInventory;

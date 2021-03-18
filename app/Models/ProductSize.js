"use strict";

const Model = use("Model");

class ProductSize extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "ProductSizeHook.formatPrice");
  }

  product() {
    return this.belongsTo("App/Models/Product");
  }

  inventory() {
    return this.hasOne("App/Models/ProductInventory", "id", "size_id");
  }

  colors() {
    return this.hasMany("App/Models/ProductColor", "id", "size_id");
  }
}

module.exports = ProductSize;

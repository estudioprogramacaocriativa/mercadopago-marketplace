"use strict";

const Model = use("Model");

class ProductCategory extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "ProductCategoryHook.friendlyUrl");
    this.addHook("beforeSave", "ProductCategoryHook.setStatus");
  }
 
  products() {
    return this.hasMany("App/Models/Product", "id", "category_id");
  }

  product() {
    return this.hasOne("App/Models/Product", "id", "category_id");
  }
}

module.exports = ProductCategory;

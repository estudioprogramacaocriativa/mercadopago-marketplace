"use strict";

const Model = use("Model");

class Product extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "ProductHook.formatPrice");
    this.addHook("beforeSave", "ProductHook.formatDate");
    this.addHook("beforeSave", "ProductHook.setStatus");
    this.addHook("beforeSave", "ProductHook.setFriendlyUrl");
  }

  category() {
    return this.belongsTo("App/Models/ProductCategory", "category_id");
  }

  sizes() {
    return this.hasMany("App/Models/ProductSize", "id", "product_id");
  }

  colors() {
    return this.hasMany("App/Models/ProductColor", "id", "product_id");
  }

  inventories() {
    return this.hasMany("App/Models/ProductInventory", "id", "product_id");
  }

  inventory() {
    return this.hasOne("App/Models/ProductInventory", "id", "product_id");
  }

  images() {
    return this.hasMany(
      "App/Models/ProductGallery",
      "id",
      "product_id"
    ).orderBy("is_cover", "desc");
  }

  imageCover() {
    return this.hasOne("App/Models/ProductGallery", "id", "product_id").where(
      "is_cover",
      1
    );
  }

  firstGalleryImage() {
    return this.hasMany("App/Models/ProductGallery", "id", "product_id").where(
      "is_cover",
      0
    );
  }
}

module.exports = Product;

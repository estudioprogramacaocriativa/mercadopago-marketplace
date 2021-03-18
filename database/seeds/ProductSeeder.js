/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */

"use strict";

const Factory = use("Factory");
const Database = use("Database");
const Product = use("App/Models/Product");
const ProductCategory = use("App/Models/ProductCategory");
const ProductSize = use("App/Models/ProductSize");
const ProductInventory = use("App/Models/ProductInventory");

class ProductSeeder {
  async run() {
    await Database.raw("SET FOREIGN_KEY_CHECKS = 0;");
    await Product.truncate();
    await ProductCategory.truncate();
    await ProductSize.truncate();
    await ProductInventory.truncate();
    await Database.raw("SET FOREIGN_KEY_CHECKS = 1;");
    for (let i = 0; i <= 5; i++) {
      const category = await Factory.model(
        "App/Models/ProductCategory"
      ).create();
      for (let j = 0; j <= 2; j++) {
        const product = await Factory.model("App/Models/Product").make();
        await category.products().save(product);
        for (let k = 0; k <= 1; k++) {
          const size = await Factory.model("App/Models/ProductSize").make();
          await product.sizes().save(size);
        }
      }
    }
    const sizes = await ProductSize.query().with("product").fetch();
    const { rows } = sizes;
    for (let i = 0; i < rows.length; i++) {
      const productId = rows[i].getRelated("product").id;
      const sizeId = rows[i].id;
      const data = {
        product_id: productId,
        size_id: sizeId,
      };
      await Factory.model("App/Models/ProductInventory").create(data);
    }
  }
}

module.exports = ProductSeeder;

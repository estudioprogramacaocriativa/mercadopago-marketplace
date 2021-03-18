"use strict";

const Schema = use("Schema");

class ProductInventorySchema extends Schema {
  up() {
    this.create("product_inventories", (table) => {
      table.increments();
      table.integer("product_id").unsigned().index("products_product_id");
      table
        .foreign("product_id")
        .references("id")
        .on("products")
        .onDelete("CASCADE");
      table.integer("size_id").unsigned().index("product_sizes_size_id");
      table
        .foreign("size_id")
        .references("id")
        .on("product_sizes")
        .onDelete("CASCADE");
      table.decimal("inventory", 10, 0);
      table.decimal("sold", 10, 0);
      table.timestamps();
    });
  }

  down() {
    this.drop("product_inventories");
  }
}

module.exports = ProductInventorySchema;

"use strict";

const Schema = use("Schema");

class ProductSizesSchema extends Schema {
  up() {
    this.create("product_sizes", (table) => {
      table.increments();
      table.integer("product_id").unsigned().index("product_sizes_product_id");
      table
        .foreign("product_id")
        .references("id")
        .on("products")
        .onDelete("CASCADE");
      table.string("name");
      table.decimal("price", 10, 2);
      table.decimal("promotional_price", 10, 2);
      table.datetime("promotional_start");
      table.datetime("promotional_end");
      table.timestamps();
    });
  }

  down() {
    this.drop("product_sizes");
  }
}

module.exports = ProductSizesSchema;

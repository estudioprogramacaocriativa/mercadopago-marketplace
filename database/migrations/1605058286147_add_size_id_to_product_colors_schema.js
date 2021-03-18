"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddSizeIdToProductColorsSchema extends Schema {
  up() {
    this.table("product_colors", (table) => {
      table.integer("size_id").unsigned().index("product_colors_size_id");
      table
        .foreign("size_id")
        .references("id")
        .on("product_sizes")
        .onDelete("restrict");
    });
  }

  down() {
    this.table("product_colors", (table) => {
      table.dropForeign("size_id");
      table.dropColumn("size_id");
    });
  }
}

module.exports = AddSizeIdToProductColorsSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColorIdToProductInventoriesSchema extends Schema {
  up() {
    this.table("product_inventories", (table) => {
      table
        .integer("color_id")
        .unsigned()
        .index("product_inventories_color_id");
      table
        .foreign("color_id")
        .references("id")
        .on("product_colors")
        .onDelete("CASCADE");
    });
  }

  down() {
    this.table("product_inventories", (table) => {
      table.dropForeign("color_id");
      table.dropColumn("color_id");
    });
  }
}

module.exports = AddColorIdToProductInventoriesSchema;

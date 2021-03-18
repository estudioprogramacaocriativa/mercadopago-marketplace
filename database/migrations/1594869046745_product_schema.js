"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", (table) => {
      table.increments();
      table.string("model");
      table.string("friendly_url");
      table.string("reference");
      table.string("code");
      table.text("headline");
      table.text("description");
      table.decimal("price", 10, 2);
      table.decimal("promotional_price", 10, 2);
      table.datetime("promotional_start");
      table.datetime("promotional_end");
      table.enu("inventory_type", ["single", "variation"]);
      table.enu("status", ["published", "draft", "scheduled", "trash"]);
      table.integer("category_id").unsigned().index("products_category_id");
      table
        .foreign("category_id")
        .references("id")
        .on("product_categories")
        .onDelete("set null");
      table.decimal("width", 10, 2);
      table.decimal("height", 10, 2);
      table.decimal("length", 10, 2);
      table.decimal("weight", 10, 2);
      table.timestamps();
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;

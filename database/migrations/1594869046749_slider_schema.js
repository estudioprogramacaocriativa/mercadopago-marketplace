"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SliderSchema extends Schema {
  up() {
    this.create("sliders", (table) => {
      table.increments();
      table.string("title");
      table.text("subtitle");
      table.enu("has_link", ["yes", "no"]).defaultTo("no");
      table.string("url");
      table.enu("target", ["_self", "_blank"]).defaultTo("_self");
      table.enu("status", ["active", "inactive", "trash"]);
      table.integer("image_big").unsigned().index("sliders_image_big");
      table
        .foreign("image_big")
        .references("id")
        .on("media")
        .onDelete("set null");
      table.integer("image_small ").unsigned().index("sliders_image_small");
      table
        .foreign("image_small")
        .references("id")
        .on("media")
        .onDelete("set null");
      table.integer("product_id").unsigned().index("sliders_product_id");
      table.enu("type", ["product", "cta"]);
      table
        .foreign("product_id")
        .references("id")
        .on("products")
        .onDelete("set null");
      table.integer("category_id").unsigned().index("sliders_category_id");
      table
        .foreign("category_id")
        .references("id")
        .on("product_categories")
        .onDelete("set null");
      table.timestamps();
    });
  }

  down() {
    this.drop("sliders");
  }
}

module.exports = SliderSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MediaSchema extends Schema {
  up() {
    this.create("media", (table) => {
      table.increments();
      table.string("name");
      table.text("path");
      table.string("title");
      table.string("alt");
      table.string("extension");
      table.string("size");
      table.string("type");
      table
        .enu("status", ["published", "draft", "trash"])
        .defaultTo("published");
      table.timestamps();
    });
  }

  down() {
    this.drop("media");
  }
}

module.exports = MediaSchema;

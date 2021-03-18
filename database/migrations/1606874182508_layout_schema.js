"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LayoutSchema extends Schema {
  up() {
    this.create("layouts", (table) => {
      table.increments();
      table.string("page");
      table.json("content");
      table.timestamps();
    });
  }

  down() {
    this.drop("layouts");
  }
}

module.exports = LayoutSchema;

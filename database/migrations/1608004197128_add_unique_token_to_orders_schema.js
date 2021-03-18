"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddUniqueTokenToOrdersSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.text("unique_token");
    });
  }

  down() {
    this.table("orders", (table) => {
      table.dropColumn("unique_token");
    });
  }
}

module.exports = AddUniqueTokenToOrdersSchema;

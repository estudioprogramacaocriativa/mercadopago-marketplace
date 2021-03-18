"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnsToOrdersSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.string("mp_payment_id");
      table.string("mp_preference_id");
    });
  }

  down() {
    this.table("orders", (table) => {
      table.dropColumn("mp_payment_id");
      table.dropColumn("mp_preference_id");
    });
  }
}

module.exports = AddColumnsToOrdersSchema;

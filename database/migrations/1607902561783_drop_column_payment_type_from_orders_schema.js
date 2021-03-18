"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DropColumnPaymentTypeFromOrdersSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.dropColumn("payment_type");
    });
  }

  down() {
    this.table("orders", (table) => {
      table.enu("payment_type", ["billet", "credit_card"]);
    });
  }
}

module.exports = DropColumnPaymentTypeFromOrdersSchema;

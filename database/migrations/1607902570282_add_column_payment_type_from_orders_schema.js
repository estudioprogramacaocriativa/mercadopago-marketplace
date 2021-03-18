"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddColumnPaymentTypeFromOrdersSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.enu("payment_type", ["billet", "credit_card", "cash"]);
    });
  }

  down() {
    this.table("orders", (table) => {
      table.dropColumn("payment_type");
    });
  }
}

module.exports = AddColumnPaymentTypeFromOrdersSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ChangeColumnPriceTypeForOrderItemsSchema extends Schema {
  up() {
    this.alter("order_items", (table) => {
      table.decimal("price", 10, 2).alter();
    });
  }

  down() {
    this.alter("order_items", (table) => {
      table.integer("price").alter();
    });
  }
}

module.exports = ChangeColumnPriceTypeForOrderItemsSchema;

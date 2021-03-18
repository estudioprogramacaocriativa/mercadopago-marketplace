"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddFieldsMarketplaceToOrdersSchema extends Schema {
  up() {
    this.table("orders", (table) => {
      table.string("status_detail");
      table.string("mp_order_id");
      table.datetime("date_approved");
    });
  }

  down() {
    this.table("orders", (table) => {
      table.dropColumn("status_detail");
      table.dropColumn("mp_order_id");
      table.dropColumn("date_approved");
    });
  }
}

module.exports = AddFieldsMarketplaceToOrdersSchema;

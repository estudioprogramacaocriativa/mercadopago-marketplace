"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderItemSchema extends Schema {
  up() {
    this.create("order_items", (table) => {
      table.increments();

      table.integer("order_id").unsigned().index("orders_items_order_id");
      table.foreign("order_id").references("id").on("orders");

      table
        .integer("inventory_id")
        .unsigned()
        .index("orders_items_inventory_id");
      table.foreign("inventory_id").references("id").on("product_inventories");

      table.integer("quantity");
      table.integer("price");
      table.timestamps();
    });
  }

  down() {
    this.drop("order_items");
  }
}

module.exports = OrderItemSchema;

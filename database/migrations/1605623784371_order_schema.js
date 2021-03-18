"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderSchema extends Schema {
  up() {
    this.create("orders", (table) => {
      table.increments();

      table.integer("user_id").unsigned().index("orders_user_id");
      table.foreign("user_id").references("id").on("users");

      table.integer("coupon_id").unsigned().index("orders_coupon_id");
      table.foreign("coupon_id").references("id").on("users");

      table.integer("address_id").unsigned().index("orders_address_id");
      table.foreign("address_id").references("id").on("user_addresses");

      table.decimal("amount", 10, 2);
      table.decimal("fees", 10, 2);
      table.string("coupon_code");
      table.decimal("coupon_value", 10, 2);
      table.integer("shipment_service");
      table.decimal("shipment_value", 10, 2);
      table.enu("payment_type", ["billet", "credit_card"]);
      table.text("billet_url");
      table.integer("installments_qty");
      table.decimal("installment_amount", 10, 2);
      table.string("tracking_code");
      table.string("status");
      table.timestamps();
    });
  }

  down() {
    this.drop("orders");
  }
}

module.exports = OrderSchema;

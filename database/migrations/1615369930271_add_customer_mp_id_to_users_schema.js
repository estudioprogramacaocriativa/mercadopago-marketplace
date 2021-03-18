"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddCustomerMpIdToUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.string("customer_mp_id");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("customer_mp_id");
    });
  }
}

module.exports = AddCustomerMpIdToUsersSchema;

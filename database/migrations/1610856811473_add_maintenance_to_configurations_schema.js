"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddMaintenanceToConfigurationsSchema extends Schema {
  up() {
    this.table("application_configurations", (table) => {
      table.boolean("maintenance").defaultTo(false);
    });
  }

  down() {
    this.table("application_configurations", (table) => {
      table.dropColumn("maintenance");
    });
  }
}

module.exports = AddMaintenanceToConfigurationsSchema;

"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApplicationMercadoPagoConfigurationSchema extends Schema {
  up() {
    this.create("application_mercado_pago_configurations", (table) => {
      table.increments();
      table.integer("days_to_expirate_billet");
      table.string("payment_options");
      table.string("secret_key");
      table.string("public_key");
      table.string("app_id");
      table.decimal("comission_fee", 10, 2);
      table.boolean("is_active").defaultTo(false);
      table
        .integer("email_id")
        .unsigned()
        .index("application_notifications_email_notification");
      table
        .foreign("email_id")
        .references("id")
        .on("application_emails")
        .onDelete("restrict");
    });
  }

  down() {
    this.drop("application_mercado_pago_configurations");
  }
}

module.exports = ApplicationMercadoPagoConfigurationSchema;

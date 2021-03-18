"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApplicationConfigurationSchema extends Schema {
  up() {
    this.create("application_configurations", (table) => {
      table.increments();
      table.string("fantasy_name");
      table.string("social_name");
      table.bigInteger("phone_support");
      table.bigInteger("phone_whatsapp");
      table.bigInteger("phone_telegram");
      table.bigInteger("cnpj");
      table.bigInteger("zip_code");
      table.integer("public_place_number");
      table.string("public_place");
      table.string("district");
      table.string("city");
      table.string("state");
      table.text("complement");
      table.text("whatsapp_message");
      table.text("about");
      table
        .integer("public_email_id")
        .unsigned()
        .index("application_notifications_public_email_id");
      table
        .foreign("public_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
    });
  }

  down() {
    this.drop("application_configurations");
  }
}

module.exports = ApplicationConfigurationSchema;

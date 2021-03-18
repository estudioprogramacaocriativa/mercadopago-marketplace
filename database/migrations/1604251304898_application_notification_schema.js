"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApplicationNotificationSchema extends Schema {
  up() {
    this.create("application_notifications", (table) => {
      table.increments();
      table.boolean("notify_when_new_reseler");
      table.boolean("notify_when_new_client");
      table.boolean("notify_when_new_admin");
      table.boolean("notify_when_new_contact");
      table.boolean("notify_when_new_newsletter");
      table.boolean("notify_when_new_order");
      table.boolean("notify_when_order_approved");
      table.boolean("notify_when_order_cancelled");

      table
        .integer("reseler_email_id")
        .unsigned()
        .index("application_notifications_reseler_email_id");
      table
        .foreign("reseler_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
      table
        .integer("client_email_id")
        .unsigned()
        .index("application_notifications_client_email_id");
      table
        .foreign("client_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
      table
        .integer("admin_email_id")
        .unsigned()
        .index("application_notifications_admin_email_id");
      table
        .foreign("admin_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
      table
        .integer("contact_email_id")
        .unsigned()
        .index("application_notifications_contact_email_id");
      table
        .foreign("contact_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
      table
        .integer("newsletter_email_id")
        .unsigned()
        .index("application_notifications_newsletter_email_id");
      table
        .foreign("newsletter_email_id")
        .references("id")
        .on("application_emails")
        .onDelete("no action");
    });
  }

  down() {
    this.drop("application_notifications");
  }
}

module.exports = ApplicationNotificationSchema;

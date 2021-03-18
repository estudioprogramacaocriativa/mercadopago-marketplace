"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ApplicationEmailSchema extends Schema {
  up() {
    this.create("application_emails", (table) => {
      table.increments();
      table.string("email");
      table.timestamps();
    });
  }

  down() {
    this.drop("application_emails");
  }
}

module.exports = ApplicationEmailSchema;

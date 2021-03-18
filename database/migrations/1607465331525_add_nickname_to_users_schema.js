"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddNicknameToUsersSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.string("nickname");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("nickname");
    });
  }
}

module.exports = AddNicknameToUsersSchema;

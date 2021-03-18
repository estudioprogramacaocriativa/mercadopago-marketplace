"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", (table) => {
      table.increments();
      table.string("name", 80);
      table.string("last_name", 80);
      table.string("email", 254).notNullable().unique();
      table.string("password", 60);
      table.bigInteger("cpf").unique();
      table.date("birth_date");
      table.bigInteger("phone");
      table.text("first_access_hash");
      table.integer("activation_code");
      table.datetime("email_verified_at");
      table.text("block_reason", "longtext");
      table.integer("user_id").unsigned().index("users_user_id");
      table
        .foreign("user_id")
        .references("id")
        .on("users")
        .onDelete("restrict");
      table.integer("media_id").unsigned().index("users_media_id");
      table
        .foreign("media_id")
        .references("id")
        .on("media")
        .onDelete("set null");
      table.enum("role", ["client", "reseler", "master"]).defaultTo("client");
      table
        .enum("status", ["active", "inactive", "blocked"])
        .defaultTo("inactive");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;

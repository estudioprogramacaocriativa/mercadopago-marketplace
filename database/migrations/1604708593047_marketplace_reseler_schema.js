"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MarketplaceReselerSchema extends Schema {
  up() {
    this.create("marketplace_reselers", (table) => {
      table.increments();
      table.integer("user_id").unsigned().index();
      table.foreign("user_id").references("id").on("users").onDelete("CASCADE");
      table.string("share_profile_hash");
      table.timestamps();
    });
  }

  down() {
    this.drop("marketplace_reselers");
  }
}

module.exports = MarketplaceReselerSchema;

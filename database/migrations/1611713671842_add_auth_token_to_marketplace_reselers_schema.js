"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddAuthTokenToMarketplaceReselersSchema extends Schema {
  up() {
    this.table("marketplace_reselers", (table) => {
      table.string("authorization_code").after("share_profile_hash");
      table.string("expires_in").after("authorization_code");
      table.string("refresh_token").after("expires_in");
      table.string("access_token").after("refresh_token");
      table.string("public_key").after("access_token");
      table.string("mp_user_id").after("public_key");
      table.string("scope").after("mp_user_id");
    });
  }

  down() {
    this.table("marketplace_reselers", (table) => {
      table.dropColumn("authorization_code");
      table.dropColumn("expires_in");
      table.dropColumn("refresh_token");
      table.dropColumn("access_token");
      table.dropColumn("public_key");
      table.dropColumn("mp_user_id");
      table.dropColumn("scope");
    });
  }
}

module.exports = AddAuthTokenToMarketplaceReselersSchema;

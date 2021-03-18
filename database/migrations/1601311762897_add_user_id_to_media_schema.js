'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddUserIdToMediaSchema extends Schema {
  up() {
    this.table('media', (table) => {
      table.integer('user_id').unsigned().index('users_user_id');
      table.foreign('user_id').references('id').on('users').onDelete('cascade');
    });
  }

  down() {
    this.table('media', table => {
      table.dropForeign('user_id');
      table.dropColumn('user_id');
    });
  }
}

module.exports = AddUserIdToMediaSchema;

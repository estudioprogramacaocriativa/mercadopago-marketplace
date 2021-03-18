'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserAddressSchema extends Schema {
  up() {
    this.create('user_addresses', table => {
      table.increments();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').on('users').onDelete('CASCADE');
      table.string('name');
      table.bigInteger('zip_code');
      table.integer('public_place_number');
      table.string('public_place');
      table.string('district');
      table.string('city');
      table.string('state');
      table.text('complement');
      table.boolean('main');
      table.timestamps();
    });
  }

  down() {
    this.drop('user_addresses');
  }
}

module.exports = UserAddressSchema;

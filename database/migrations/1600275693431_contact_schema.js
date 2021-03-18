'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ContactSchema extends Schema {
  up() {
    this.create('contacts', (table) => {
      table.increments();
      table.string('name');
      table.string('subject');
      table.string('email');
      table.bigInteger('phone');
      table.text('message');
      table.enu('status', ['readed', 'unreaded']);
      table.timestamps();
    });
  }

  down() {
    this.drop('contacts');
  }
}

module.exports = ContactSchema;

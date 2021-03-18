'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class NewsletterSchema extends Schema {
  up() {
    this.create('newsletters', table => {
      table.increments();
      table.string('name');
      table.string('email').unique();
      table.timestamps();
    });
  }

  down() {
    this.drop('newsletters');
  }
}

module.exports = NewsletterSchema;

'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ApplicationSeoSchema extends Schema {
  up() {
    this.create('application_seo', (table) => {
      table.increments();
      table.string('title');
      table.text('description', 'mediumtext');
      table.integer('media_id').unsigned().index('media_id_index');
      table.foreign('media_id').references('id').on('media');
      table.timestamps();
    });
  }

  down() {
    this.drop('application_seo');
  }
}

module.exports = ApplicationSeoSchema;

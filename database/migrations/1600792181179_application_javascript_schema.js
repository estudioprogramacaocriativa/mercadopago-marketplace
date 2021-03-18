'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ApplicationJavascriptSchema extends Schema {
  up() {
    this.create('application_javascripts', table => {
      table.increments();
      table.text('script_head', 'longtext');
      table.text('script_body', 'longtext');
      table.timestamps();
    });
  }

  down() {
    this.drop('application_javascripts');
  }
}

module.exports = ApplicationJavascriptSchema;

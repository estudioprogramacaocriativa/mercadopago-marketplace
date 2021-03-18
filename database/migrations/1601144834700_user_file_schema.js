'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class UserFileSchema extends Schema {
  up() {
    this.create('user_files', table => {
      table.increments();
      table
        .integer('document_media_id')
        .unsigned()
        .index('media_user_files_document_media_id');
      table
        .foreign('document_media_id')
        .references('id')
        .on('media')
        .onDelete('restrict');
      table
        .integer('selfie_face_media_id')
        .unsigned()
        .index('media_selfie_face_media_id');
      table
        .foreign('selfie_face_media_id')
        .references('id')
        .on('media')
        .onDelete('restrict');
      table
        .integer('selfie_document_media_id')
        .unsigned()
        .index('media_selfie_document_media_id');
      table
        .foreign('selfie_document_media_id')
        .references('id')
        .on('media')
        .onDelete('restrict');
      table.integer('terms_media_id').unsigned().index('media_terms_media_id');
      table
        .foreign('terms_media_id')
        .references('id')
        .on('media')
        .onDelete('restrict');
      table.enu('document_status', ['pending', 'in_analisy', 'refused', 'approved']);
      table.enu('selfie_face_status', ['pending', 'in_analisy', 'refused', 'approved']);
      table.enu('selfie_document_status', ['pending', 'in_analisy', 'refused', 'approved']);
      table.enu('terms_status', ['pending', 'in_analisy', 'refused', 'approved']);
      table.enu('status', ['pending', 'in_analisy', 'refused', 'approved']);
      table.integer('user_id').unsigned().index('users_user_id');
      table.foreign('user_id').references('id').on('users').onDelete('cascade');

      table.timestamps();
    });
  }

  down() {
    this.drop('user_files');
  }
}

module.exports = UserFileSchema;

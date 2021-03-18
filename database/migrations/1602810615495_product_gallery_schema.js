'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class ProductGallerySchema extends Schema {
  up() {
    this.create('product_galleries', (table) => {
      table.increments();
      table.integer('media_id').unsigned().index('product_galleries_media_id');
      table
        .integer('product_id')
        .unsigned()
        .index('product_galleries_product_id');
      table
        .foreign('media_id')
        .references('id')
        .on('media')
        .onDelete('set null');
      table
        .foreign('product_id')
        .references('id')
        .on('products')
        .onDelete('set null');
      table.boolean('is_cover').defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop('product_galleries');
  }
}

module.exports = ProductGallerySchema;

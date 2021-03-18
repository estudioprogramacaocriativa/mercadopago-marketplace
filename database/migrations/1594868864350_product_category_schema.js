'use strict'

const Schema = use('Schema')

class ProductCategorySchema extends Schema {
  up () {
    this.create('product_categories', (table) => {
      table.increments()
      table.integer('category_id')
        .unsigned()
        .index('index_category_id');

      table.foreign('category_id')
        .references('id')
        .on('product_categories')
        .onDelete('set null');

      table.integer('media_id')
        .unsigned()
        .index('index_media_id');

      table.foreign('media_id')
        .references('id')
        .on('media');

      table.string('title');
      table.string('friendly_url');
      table.text('description')
      table.enu('status', ['published', 'draft', 'scheduled', 'trash']);
      table.timestamps()
    })
  }

  down () {
    this.drop('product_categories')
  }
}

module.exports = ProductCategorySchema

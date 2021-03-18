'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class CouponSchema extends Schema {
  up() {
    this.create('coupons', table => {
      table.increments();
      table.string('name');
      table.string('code');
      table.enu('type', ['percent', 'fix']);
      table.datetime('start_date');
      table.datetime('end_date');
      table.decimal('value', 10, 2);
      table.enu('status', ['active', 'inactive']);
      table.timestamps();
    });
  }

  down() {
    this.drop('coupons');
  }
}

module.exports = CouponSchema;

'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Coupon extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeSave', 'CouponHook.setStatus');
    this.addHook('beforeSave', 'CouponHook.formatValue');
    this.addHook('beforeSave', 'CouponHook.formatDates');
    this.addHook('beforeSave', 'CouponHook.uppercaseString');
  }
}

module.exports = Coupon;

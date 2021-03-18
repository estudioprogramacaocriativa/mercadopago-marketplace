"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Order extends Model {
  items() {
    return this.hasMany("App/Models/OrderItem");
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  address() {
    return this.hasOne("App/Models/UserAddress", "address_id", "id");
  }

  coupon() {
    return this.hasOne("App/Models/Coupon", "coupon_id", "id");
  }
}

module.exports = Order;

"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrderItem extends Model {
  inventory() {
    return this.hasOne("App/Models/ProductInventory", "inventory_id", "id");
  }
}

module.exports = OrderItem;

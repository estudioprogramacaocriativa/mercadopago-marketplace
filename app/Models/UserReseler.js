"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class UserReseler extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "ReselerHook.removeMask");
    this.addHook("beforeSave", "RegisterHook.setStatus");
    this.addHook("beforeCreate", "RegisterHook.generateActivationCode");
    this.addHook("beforeCreate", "RegisterHook.generateActivationHash");
  }

  static get table() {
    return "users";
  }
}

module.exports = UserReseler;

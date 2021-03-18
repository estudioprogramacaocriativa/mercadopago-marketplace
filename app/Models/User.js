"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class User extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "RegisterHook.hashPassword");
    this.addHook("beforeSave", "RegisterHook.setStatus");
    this.addHook("beforeSave", "RegisterHook.removeMask");
    this.addHook("beforeCreate", "RegisterHook.generateActivationCode");
    this.addHook("beforeCreate", "RegisterHook.generateActivationHash");
  }

  tokens() {
    return this.hasMany("App/Models/Token");
  }

  address() {
    return this.hasOne("App/Models/UserAddress").where("main", 1);
  }

  addresses() {
    return this.hasMany("App/Models/UserAddress");
  }

  files() {
    return this.hasOne("App/Models/UserFile");
  }

  clients() {
    return this.hasMany("App/Models/User");
  }

  shareProfile() {
    return this.hasOne("App/Models/MarketplaceReseler");
  }

  orders() {
    return this.hasMany("App/Models/Order");
  }
}

module.exports = User;

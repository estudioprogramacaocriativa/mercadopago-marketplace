"use strict";

const Model = use("Model");

class UserAddress extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "UserAddressHook.removeMask");
    this.addHook("beforeSave", "UserAddressHook.handleMainProperty");
  }

  user() {
    return this.belongTo("App/Models/User");
  }
}

module.exports = UserAddress;

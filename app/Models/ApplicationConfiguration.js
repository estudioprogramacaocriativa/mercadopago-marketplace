"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ApplicationConfiguration extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "ApplicationConfigurationHook.removeMasks");
  }

  static get createdAtColumn() {
    return false;
  }

  static get updatedAtColumn() {
    return false;
  }

  email() {
    return this.hasOne("App/Models/ApplicationEmail", "public_email_id", "id");
  }
}

module.exports = ApplicationConfiguration;

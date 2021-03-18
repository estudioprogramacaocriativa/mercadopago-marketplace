'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ConfirmEmail extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeSave', 'RegisterHook.hashPassword');
  }

  static get table() {
    return 'users';
  }
}

module.exports = ConfirmEmail;

'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Profile extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeSave', 'ProfileHook.formatDate');
    this.addHook('beforeSave', 'ProfileHook.removeSlugs');
  }

  static get table() {
    return 'users';
  }
}

module.exports = Profile;

'use strict';

const Model = use('Model');

class Contact extends Model {
  static boot() {
    super.boot();
    this.addHook('beforeSave', 'ContactHook.removeMask');
    this.addHook('beforeCreate', 'ContactHook.setStatus');
  }
}

module.exports = Contact;

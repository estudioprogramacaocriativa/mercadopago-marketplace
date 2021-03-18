'use strict'

const Model = use('Model')

class PasswordReset extends Model {
  static boot() {
    super.boot();
    this.addHook("beforeSave", "PasswordEmailHook.removePreviousToken")
  }
}

module.exports = PasswordReset

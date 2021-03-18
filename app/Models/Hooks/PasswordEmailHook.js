'use strict'

const PasswordEmailHook = exports = module.exports = {}
const PasswordEmail = use("App/Models/PasswordReset")

PasswordEmailHook.removePreviousToken = async (instance) => {
  await PasswordEmail.query().where("email", instance.email).delete()
}

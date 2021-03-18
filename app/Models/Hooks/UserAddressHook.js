/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const UserAddress = use("App/Models/UserAddress");

const UserAddressHook = (exports = module.exports = {});
const Helper = use("App/Helpers");

UserAddressHook.removeMask = async (instance) => {
  if (instance.zip_code) {
    instance.zip_code = await Helper.toNumber(instance.zip_code);
  }
};

UserAddressHook.handleMainProperty = async (instance) => {
  const queryAddress = UserAddress.query().where("user_id", instance.user_id);
  const hasMain = await queryAddress.where("main", 1).first();

  if (hasMain === null) instance.main = true;
};

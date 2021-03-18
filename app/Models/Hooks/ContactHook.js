'use strict';

const ContactHook = (exports = module.exports = {});
const Helper = use('App/Helpers');

ContactHook.removeMask = async instance => {
  if (instance.phone) {
    instance.phone = await Helper.toNumber(instance.phone);
  }
};

ContactHook.setStatus = async instance => {
  instance.status = !instance.status ? 'unreaded' : !instance.status;
};

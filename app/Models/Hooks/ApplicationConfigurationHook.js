"use strict";

const ApplicationConfigurationHook = (exports = module.exports = {
});
const Helper = use("App/Helpers");

ApplicationConfigurationHook.removeMasks = async (instance) => {
  if (instance.phone_support) {
    instance.phone_support = await Helper.toNumber(instance.phone_support);
  }

  if (instance.phone_whatsapp) {
    instance.phone_whatsapp = await Helper.toNumber(instance.phone_whatsapp);
  }

  if (instance.phone_telegram) {
    instance.phone_telegram = await Helper.toNumber(instance.phone_telegram);
  }

  if (instance.zip_code) {
    instance.zip_code = await Helper.toNumber(instance.zip_code);
  }

  if (instance.cnpj) {
    instance.cnpj = await Helper.toNumber(instance.cnpj);
  }
};

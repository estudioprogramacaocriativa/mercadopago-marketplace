'use strict';

const ProfileHook = (exports = module.exports = {
});

const Helpers = use('App/Helpers');

ProfileHook.formatDate = async (instance) => {
  if (instance.birth_date) {
    instance.birth_date = await Helpers.dateToDatabase(instance.birth_date);
  }
};

ProfileHook.removeSlugs = async (instance) => {
  if (instance.phone) {
    instance.phone = await Helpers.toNumber(instance.phone);
  }

  if (instance.cpf) {
    instance.cpf = await Helpers.toNumber(instance.cpf);
  }
};

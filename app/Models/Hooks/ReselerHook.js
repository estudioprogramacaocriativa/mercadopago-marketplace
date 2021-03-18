/* eslint-disable no-await-in-loop */
/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */
/* eslint-disable no-unused-vars */

"use strict";

const ReselerHook = (exports = module.exports = {});
const Helper = use("App/Helpers");
const User = use("App/Models/User");

ReselerHook.removeMask = async (instance) => {
  if (instance.phone) {
    instance.phone = await instance.phone.replace(/\D/g, "");
  }

  if (instance.cpf) {
    instance.cpf = await instance.cpf.replace(/\D/g, "");
  }

  if (instance.birth_date) {
    instance.birth_date = await Helper.dateToDatabase(instance.birth_date);
  }
};

ReselerHook.generateActivationCode = async (userInstance) => {
  let code = Math.floor(100000 + Math.random() * 900000);
  const checkCode = await User.query().where("activation_code", code).first();

  while (checkCode !== null) {
    code = Math.floor(100000 + Math.random() * 900000);
  }

  userInstance.activation_code = code;
};

ReselerHook.generateActivationHash = async (instance) => {
  let hash = await Helper.generateCharacteres(75);
  const checkHash = await User.query().where("first_access_hash", hash).first();
  while (checkHash !== null) hash = await Helper.generateCharacteres(75);

  instance.first_access_hash = hash;
};

ReselerHook.setStatus = (instance) => {
  if (
    instance.status === undefined ||
    instance.status === "undefined" ||
    !instance.status ||
    instance.status === "false"
  )
    instance.status = "inactive";
};

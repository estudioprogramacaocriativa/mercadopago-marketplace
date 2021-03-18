/* eslint-disable no-await-in-loop */
/* eslint-disable object-curly-newline */
/* eslint-disable no-multi-assign */

"use strict";

const RegisterHook = (exports = module.exports = {});
const Hash = use("Hash");
const User = use("App/Models/User");
const Helper = use("App/Helpers");

RegisterHook.hashPassword = async (userInstance) => {
  if (userInstance.dirty.password) {
    userInstance.password = await Hash.make(userInstance.password);
  }
};

RegisterHook.removeMask = async (userInstance) => {
  if (userInstance.phone) {
    userInstance.phone = await userInstance.phone.replace(/\D/g, "");
  }

  if (userInstance.cpf) {
    userInstance.cpf = await userInstance.cpf.replace(/\D/g, "");
  }

  if (userInstance.birth_date) {
    userInstance.birth_date = await Helper.dateToDatabase(
      userInstance.birth_date
    );
  }
};

RegisterHook.generateActivationCode = async (userInstance) => {
  let code = Math.floor(100000 + Math.random() * 900000);
  const checkCode = await User.query().where("activation_code", code).first();

  while (checkCode !== null) {
    code = Math.floor(100000 + Math.random() * 900000);
  }

  userInstance.activation_code = code;
};

RegisterHook.generateActivationHash = async (instance) => {
  let hash = await Helper.generateCharacteres(75);
  const checkHash = await User.query().where("first_access_hash", hash).first();
  while (checkHash !== null) hash = await Helper.generateCharacteres(75);

  instance.first_access_hash = hash;
};

RegisterHook.setStatus = (instance) => {
  if (
    instance.status === undefined ||
    instance.status === "undefined" ||
    !instance.status ||
    instance.status === "false"
  )
    instance.status = "inactive";
};

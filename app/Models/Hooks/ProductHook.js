"use strict";

/* eslint-disable no-multi-assign */
/* eslint-disable object-curly-newline */
const ProductHook = (exports = module.exports = {});
const Helpers = use("App/Helpers");

ProductHook.formatPrice = async (instance) => {
  if (instance.dirty.price)
    instance.price = await Helpers.decimalToDatabase(instance.price);

  if (instance.dirty.promotional_price)
    instance.promotional_price = await Helpers.decimalToDatabase(
      instance.promotional_price
    );

  if (instance.dirty.width)
    instance.width = await Helpers.decimalToDatabase(instance.width);

  if (instance.dirty.height)
    instance.height = await Helpers.decimalToDatabase(instance.height);

  if (instance.dirty.length)
    instance.length = await Helpers.decimalToDatabase(instance.length);

  if (instance.dirty.weight)
    instance.weight = await Helpers.decimalToDatabase(instance.weight);
};

ProductHook.formatDate = async (instance) => {
  if (instance.promotional_start)
    instance.promotional_start = await Helpers.dateToDatabase(
      instance.promotional_start,
      true
    );

  if (instance.promotional_end)
    instance.promotional_end = await Helpers.dateToDatabase(
      instance.promotional_end,
      true
    );
};

ProductHook.setStatus = async (instance) => {
  if (instance.status === undefined) instance.status = "published";
};

ProductHook.setFriendlyUrl = async (instance) => {
  if (instance.model)
    instance.friendly_url = await Helpers.friendlyUrl(instance.model);
};

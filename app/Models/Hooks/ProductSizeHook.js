'use strict'

const ProductSizeHook = exports = module.exports = {}
const Helpers = use('App/Helpers');

ProductSizeHook.formatPrice = async instance => {
  if (instance.dirty.value)
    instance.value = await Helpers.decimalToDatabase(instance.value);
}

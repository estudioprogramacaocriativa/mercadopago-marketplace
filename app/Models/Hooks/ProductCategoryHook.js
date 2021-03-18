'use strict';

const ProductCategoryHook = (exports = module.exports = {
});
const Helpers = use('App/Helpers');

ProductCategoryHook.friendlyUrl = async instance => {
  instance.friendly_url = await Helpers.friendlyUrl(instance.title);
};

ProductCategoryHook.setStatus = async instance => {
  if(!instance.status)
    instance.status = 'draft';
};

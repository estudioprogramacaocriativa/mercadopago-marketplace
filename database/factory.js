'use strict';

const Factory = use('Factory');
const Helpers = use('App/Helpers');

Factory.blueprint('App/Models/ProductCategory', async (faker) => {
  const title = faker.word({
    length: 5,
  });
  const friendlyUrl = await Helpers.friendlyUrl(title);

  return {
    title,
    friendly_url: friendlyUrl,
    status: 'published',
  };
});

Factory.blueprint('App/Models/Product', async (faker) => {
  const model = faker.sentence({
    words: 3,
  });
  const friendlyUrl = await Helpers.friendlyUrl(model);

  return {
    model,
    friendly_url: friendlyUrl,
    price: faker.floating({
      min: 5,
      max: 50,
      fixed: 2,
    }),
    headline: faker.paragraph({
      sentences: 1,
    }),
    description: faker.paragraph({
      sentences: 4,
    }),
    status: 'published',
  };
});

Factory.blueprint('App/Models/ProductSize', async (faker) => {
  return {
    name: faker.integer({
      min: 16,
      max: 38,
    }),
  };
});

Factory.blueprint('App/Models/ProductInventory', async (faker, index, data) => {
  return {
    product_id: data.product_id,
    size_id: data.size_id,
    inventory: faker.integer({
      min: 1,
      max: 100,
    }),
  };
});

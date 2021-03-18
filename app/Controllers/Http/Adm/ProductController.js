/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

"use strict";

const Resource = use("App/Models/Product");
const ResourceGallery = use("App/Models/ProductGallery");
const ResourceSize = use("App/Models/ProductSize");
const ResourceColor = use("App/Models/ProductColor");
const ResourceInventory = use("App/Models/ProductInventory");
const Helpers = use("App/Helpers");

class ProductController {
  async index({ request, response }) {
    const req = request.all();
    const offset = req.offset ? parseInt(req.offset, 10) : 1;
    const limit = req.limit ? parseInt(req.limit, 10) : 10;
    const search = req.search ? req.search : null;
    const paginate = req.paginate ? req.paginate : true;
    const orderBy = req.orderBy ? req.orderBy : "created_at";

    let resources = Resource.query()
      .with("category")
      .with("imageCover")
      .with("inventory")
      .with("sizes.colors.inventory")
      .with("sizes.inventory")
      .orderBy(orderBy, "asc");

    if (search !== null) {
      const searchVal = `%${decodeURIComponent(search)}%`;
      resources = resources
        .where("model", "like", searchVal)
        .orWhere("reference", "like", searchVal)
        .orWhere("headline", "like", searchVal)
        .orWhere("code", "like", searchVal);
    }

    if (paginate === "false") resources = await resources.fetch();
    else resources = await resources.paginate(offset, limit);

    return response.json({
      data: {
        resources,
      },
    });
  }

  async store({ request }) {
    const {
      code,
      model,
      status,
      price,
      categoryId,
      friendlyUrl,
      description,
      headline,
      width,
      height,
      length,
      weight,
      promotionalPrice,
      promotionalStart,
      promotionalEnd,
      inventoryType,
      images,
      variations,
      imageCover,
      stock,
    } = request.all();

    const data = {
      model,
      status,
      price,
      description,
      headline,
      width,
      height,
      length,
      weight: parseFloat(weight),
      code,
      inventory_type: inventoryType,
      category_id: categoryId,
      friendly_url: friendlyUrl,
      promotional_price: promotionalPrice,
      promotional_start: promotionalStart,
      promotional_end: promotionalEnd,
    };

    const resource = await Resource.create(data);

    await this.manageGallery(images, resource.id);

    if (variations !== undefined)
      await this.manageSizes(variations, resource.id);

    if (stock !== undefined && inventoryType !== "variation")
      await this.manageSelfInventory(stock, resource.id);

    if (imageCover) {
      await resource.imageCover().update({
        is_cover: 1,
      });
    }

    return {
      data: {
        message: `O produto ${resource.model} foi inserido com sucesso!`,
        resource,
      },
    };
  }

  async show({ params, response }) {
    const resource = await Resource.query()
      .with("images")
      .with("imageCover")
      .with("sizes.inventory")
      .with("sizes.colors.inventory")
      .with("inventory")
      .where("id", params.id)
      .first();

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O produto solicitado não foi encontrado!",
        },
      });
    }

    return {
      data: {
        resource,
      },
    };
  }

  async update({ params, request, response }) {
    const resource = await Resource.find(params.id);
    const {
      code,
      model,
      status,
      price,
      categoryId,
      friendlyUrl,
      description,
      headline,
      width,
      height,
      length,
      weight,
      inventoryType,
      promotionalPrice,
      promotionalStart,
      promotionalEnd,
      images,
      variations,
      imageCover,
      stock,
    } = request.all();

    const data = {
      model,
      status,
      price,
      description,
      headline,
      width,
      height,
      length,
      weight,
      code,
      inventory_type: inventoryType,
      category_id: categoryId,
      friendly_url: friendlyUrl,
      promotional_price: promotionalPrice,
      promotional_start: promotionalStart,
      promotional_end: promotionalEnd,
    };

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O produto solicitado não foi encontrado!",
        },
      });
    }

    resource.merge(data);
    await resource.save(data);

    if (stock !== undefined && inventoryType !== "variation")
      await this.manageSelfInventory(stock, resource.id);

    if (images !== undefined) await this.manageGallery(images, resource.id);

    if (variations !== undefined)
      await this.manageSizes(variations, resource.id);

    if (imageCover) {
      await ResourceGallery.query().where("product_id", resource.id).update({
        is_cover: 0,
      });

      await ResourceGallery.query()
        .where("media_id", imageCover)
        .where("product_id", resource.id)
        .update({
          is_cover: 1,
        });
    }

    return {
      data: {
        resource,
        message: `O produto ${resource.model} foi atualizado com sucesso.`,
      },
    };
  }

  async destroy({ params, response }) {
    const resource = await Resource.find(params.id);

    if (!resource) {
      return response.status(404).json({
        data: {
          message: "O produto solicitado não foi encontrado!",
        },
      });
    }

    try {
      await resource.images().delete();
      await resource.delete();

      return {
        data: {
          message: "O produto foi deletado permanentemente!",
        },
      };
    } catch (e) {
      return response.status(400).json({
        data: {
          message: `Não foi possível remover o produto no momento. Motivo: ${e.message}`,
        },
      });
    }
  }

  async destroyAll({ request }) {
    const requestAll = request.all();
    let find;
    let itemName;
    const deleted = [];
    const unDeleted = [];
    let message = "";

    console.log(requestAll);

    for (const id in requestAll) {
      find = await Resource.find(requestAll[id]);

      try {
        itemName = find.model;
        await find.delete();
        deleted.push(itemName);
      } catch (e) {
        unDeleted.push(find.model);
      }
    }

    if (deleted.length > 0) {
      message += `Os seguintes registros foram removidos: ${deleted.join(
        ", ",
        deleted
      )}. `;
    }

    if (unDeleted.length > 0) {
      message += `Os seguintes registros não puderam ser removidos: ${unDeleted.join(
        ", ",
        unDeleted
      )}.`;
    }

    return {
      success: true,
      data: {
        message,
      },
    };
  }

  async manageGallery(images, productId) {
    const existImages = await ResourceGallery.query()
      .where("product_id", productId)
      .fetch();

    if (existImages.rows.length > 0) {
      await ResourceGallery.query().where("product_id", productId).delete();
    }

    Array.from(images).forEach(async (el) => {
      await ResourceGallery.create({
        product_id: productId,
        media_id: el,
      });
    });
  }

  async manageSelfInventory(stock, productId) {
    if (stock !== null && stock !== undefined && parseInt(stock, 10) !== 0) {
      const find = await ResourceInventory.query()
        .where("product_id", productId)
        .whereNull("size_id")
        .first();

      if (find) {
        await ResourceInventory.query().where("id", find.id).update({
          inventory: stock,
        });
      } else {
        await ResourceInventory.create({
          product_id: productId,
          inventory: stock,
        });
      }
    }
  }

  async manageSizes(variations, productId) {
    if (variations.length > 0) {
      let dataArr = null;
      let find;

      (async () => {
        for (let i = 0; i < variations.length; i++) {
          const el = variations[i];
          const price = await Helpers.decimalToDatabase(el.price);
          const { name } = el;
          const promotionalStart =
            el.promotionalStart !== null &&
            el.promotionalStart !== undefined &&
            el.promotionalStart !== ""
              ? await Helpers.dateToDatabase(el.promotionalStart, true)
              : null;
          const promotionalEnd =
            el.promotionalEnd !== null &&
            el.promotionalEnd !== undefined &&
            el.promotionalEnd !== ""
              ? await Helpers.dateToDatabase(el.promotionalEnd, true)
              : null;
          const promotionalPrice =
            el.promotionalPrice !== null &&
            el.promotionalPrice !== undefined &&
            el.promotionalPrice !== ""
              ? await Helpers.decimalToDatabase(el.promotionalPrice)
              : null;

          if (el.id === null || el.id === "") {
            dataArr = {
              name,
              price: price || "0.00",
              product_id: productId,
              promotional_price: promotionalPrice,
              promotional_start: promotionalStart,
              promotional_end: promotionalEnd,
            };

            find = await ResourceSize.create(dataArr);

            await ResourceInventory.create({
              product_id: productId,
              size_id: find.id,
              inventory: el.stock || 0,
            });
          } else {
            find = await ResourceSize.find(el.id);

            if (find) {
              find.merge({
                name,
                price: price || "0.00",
                promotional_price: promotionalPrice,
                promotional_start: promotionalStart,
                promotional_end: promotionalEnd,
              });
              await find.save();

              const findSizeInventory = await ResourceInventory.findBy(
                "size_id",
                find.id
              );

              if (findSizeInventory !== null) {
                findSizeInventory.merge({
                  inventory: el.stock || 0,
                });
                await findSizeInventory.save();
              } else {
                await ResourceInventory.create({
                  product_id: productId,
                  size_id: find.id,
                  inventory: el.stock || 0,
                });
              }
            }
          }

          await this.manageColor(el.colors, productId, find.id);
        }
      })();
    }
  }

  async manageColor(colors, productId, sizeId) {
    if (colors !== undefined && colors.length > 0) {
      (async () => {
        for (let i = 0; i < colors.length; i++) {
          const el = colors[i];
          const promotionalStart =
            el.promotionalStart !== null && el.promotionalStart !== ""
              ? await Helpers.dateToDatabase(el.promotionalStart, true)
              : null;
          const promotionalEnd =
            el.promotionalEnd !== null && el.promotionalEnd !== ""
              ? await Helpers.dateToDatabase(el.promotionalEnd, true)
              : null;
          const price = await Helpers.decimalToDatabase(el.price);
          const { name } = el;
          const promotionalPrice =
            el.promotionalPrice !== null && el.promotionalPrice !== ""
              ? await Helpers.decimalToDatabase(el.promotionalPrice)
              : null;

          if (el.id === null || el.id === "") {
            const dataArr = {
              name,
              price: price || "0.00",
              size_id: sizeId,
              product_id: productId,
              promotional_price: promotionalPrice,
              promotional_start: promotionalStart,
              promotional_end: promotionalEnd,
            };

            const color = await ResourceColor.create(dataArr);

            await ResourceInventory.create({
              product_id: productId,
              size_id: sizeId,
              color_id: color.id,
              inventory: el.stock || 0,
            });
          } else {
            const find = await ResourceColor.find(el.id);

            if (find) {
              find.merge({
                name,
                price: price || "0.00",
                promotional_price: promotionalPrice,
                promotional_start: promotionalStart,
                promotional_end: promotionalEnd,
              });
              await find.save();

              const findSizeInventory = await ResourceInventory.query()
                .where("color_id", find.id)
                .where("size_id", sizeId)
                .where("product_id", productId)
                .first();

              if (findSizeInventory !== null) {
                findSizeInventory.merge({
                  inventory: el.stock || 0,
                });
                await findSizeInventory.save();
              } else {
                await ResourceInventory.create({
                  product_id: productId,
                  size_id: sizeId,
                  color_id: find.id,
                  inventory: el.stock || 0,
                });
              }
            }
          }
        }
      })();
    }
  }
}

module.exports = ProductController;

"use strict";

const Product = use("App/Models/Product");
const Category = use("App/Models/ProductCategory");
const Size = use("App/Models/ProductSize");
const Color = use("App/Models/ProductColor");
const Inventory = use("App/Models/ProductInventory");
const Helpers = use("App/Helpers");
const Excel = require("exceljs");

/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
class ProductImport {
  static async importRows(filelocation) {
    let workbook = new Excel.Workbook();

    workbook = await workbook.xlsx.readFile(filelocation);

    const worksheet = workbook.worksheets[0];
    const categories = [];
    const products = [];

    worksheet.eachRow(async (row, rowNumber) => {
      if (rowNumber > 1) {
        categories.push(row.getCell(4).value);
        products.push(row);
      }
    });

    await this.manageCategories(categories);
    await this.manageProducts(products);

    return {
      data: {
        message: "Sua planilha de produtos foi importada com sucesso",
      },
    };
  }

  /**
   * Create categories for products
   *
   * @param {String} categories
   */
  static async manageCategories(categories) {
    (async () => {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i] !== null) {
          const find = await this.findCategory(categories[i]);

          if (find === null) await this.createCategory(categories[i]);
        }
      }
    })();
  }

  /**
   * Manage actions
   * @param {Array} products
   */
  static async manageProducts(products) {
    (async () => {
      for (let i = 0; i < products.length; i++) {
        const code = products[i].getCell(1).value;
        const model = products[i].getCell(2).value;
        const description = products[i].getCell(3).value;
        const price =
          products[i].getCell(5).value !== null
            ? products[i].getCell(5).value
            : null;
        const inventory = products[i].getCell(6).value;
        const size = products[i].getCell(7).value;
        const color = products[i].getCell(8).value;
        const categoryId = await this.getCategoryId(
          products[i].getCell(4).value
        );

        // Handle with product
        const product = await this.handleProduct({
          code,
          model,
          price,
          description,
          categoryId,
          size,
        });

        if (size !== null) {
          // Update variation management type
          await this.updateVariationType(product, "variation");

          // Handle sizes and colors variations
          await this.handleSizes({
            product,
            size,
            color,
            inventory,
            price,
          });
        } else {
          // Update variation management type
          await this.updateVariationType(product, "single");
          await this.handleDefaultProductSize({
            product,
            color,
            inventory,
            price,
          });
        }
      }
    })();
  }

  static async handleDefaultProductSize({ product, color, inventory, price }) {
    if (color !== null) {
      product.merge({
        inventory_type: "variation",
      });
      await product.save();

      const checkSizeDefault = await Size.query()
        .where("name", "default")
        .where("product_id", product.id)
        .first();

      let sizeResource;

      if (checkSizeDefault === null) {
        sizeResource = await Size.create({
          product_id: product.id,
          name: "default",
          price: "0.00",
        });

        await this.handleColorsVariation({
          color,
          product,
          sizeId: sizeResource.id,
          inventory,
          price,
        });
      } else {
        // update this
        await this.handleColorsVariation({
          color,
          product,
          sizeId: checkSizeDefault.id,
          inventory,
          price,
        });
      }
    } else {
      const checkSizeInventory = await Inventory.query()
        .where("product_id", product.id)
        .whereNull("size_id")
        .whereNull("color_id")
        .first();

      if (checkSizeInventory === null) {
        await Inventory.create({
          product_id: product.id,
          inventory,
        });
      } else {
        checkSizeInventory.merge({
          inventory,
        });
        await checkSizeInventory.save();
      }
    }
  }

  static async handleSizes({ product, size, color, inventory, price }) {
    const checkSize = await Size.query()
      .where("name", size)
      .where("product_id", product.id)
      .first();

    let sizeResource;

    if (checkSize === null) {
      sizeResource = await Size.create({
        product_id: product.id,
        name: size,
        price,
      });

      // Insert new size variation inventory
      await Inventory.create({
        product_id: product.id,
        size_id: sizeResource.id,
        inventory,
      });
    } else {
      sizeResource = checkSize;

      // Update size variation value
      checkSize.merge({
        price,
      });
      await checkSize.save();

      // Update size variation inventory
      const checkSizeInventory = await Inventory.query()
        .where("product_id", product.id)
        .andWhere("size_id", checkSize.id)
        .first();

      if (checkSizeInventory === null) {
        await Inventory.create({
          product_id: product.id,
          size_id: checkSize.id,
          inventory,
        });
      } else {
        checkSizeInventory.merge({
          inventory,
        });
        await checkSizeInventory.save();
      }
    }

    await this.handleColorsVariation({
      color,
      product,
      sizeId: sizeResource.id,
      inventory,
      price,
    });
  }

  /**
   * Update product variation management type
   * @param {Product} product
   * @param {String} type
   */
  static async updateVariationType(product, type) {
    if (type === "variation")
      product.merge({
        price: "0.00",
      });

    product.merge({
      inventory_type: type,
    });
    await product.save();
  }

  static async handleColorsVariation({
    color,
    product,
    sizeId,
    inventory,
    price,
  }) {
    if (color !== null) {
      // Update variation management type
      product.merge({
        inventory_type: "variation",
      });
      await product.save();

      const checkColor = await Color.query()
        .where("name", color)
        .where("product_id", product.id)
        .first();

      if (checkColor === null) {
        const colorResource = await Color.create({
          product_id: product.id,
          size_id: sizeId,
          price,
          name: color,
        });

        // Insert new color variation inventory
        await Inventory.create({
          product_id: product.id,
          size_id: sizeId,
          color_id: colorResource.id,
          inventory,
        });
      } else {
        const checkInventory = await Inventory.query()
          .where("product_id", product.id)
          .andWhere("size_id", null)
          .first();

        checkColor.merge({
          price,
          name: color,
        });
        checkColor.save();

        if (checkInventory === null) {
          await Inventory.create({
            product_id: product.id,
            size_id: sizeId,
            color_id: checkColor.id,
            inventory,
          });
        } else {
          checkInventory.merge({
            inventory,
          });
          await checkInventory.save();
        }
      }
    }
  }

  /**
   * Create or update a product
   * @param {Object} param0
   */
  static async handleProduct({
    code,
    model,
    description,
    price,
    categoryId,
    size,
  }) {
    let product = await Product.findBy("code", code);

    const productData = {
      model,
      description,
      category_id: categoryId,
      status: "published",
    };

    // Update or create a new product
    if (product !== null) {
      product.merge(productData);

      await product.save();

      if (size === null) {
        await Product.query().where("code", code).update({
          price,
        });
      }

      return product;
    }

    productData.code = code;
    product = await Product.create(productData);

    if (size === null) {
      await Product.query().where("id", product.id).update({
        price,
      });
    }

    return product;
  }

  /**
   * Try to find an specific category
   * @param {string} name
   */
  static async findCategory(name) {
    const categoryFriendly = await Helpers.friendlyUrl(name);
    const category = await Category.findBy("friendly_url", categoryFriendly);

    return category;
  }

  /**
   * Insert a new category
   * @param {string} category
   */
  static async createCategory(category) {
    await Category.create({
      title: category,
      status: "published",
    });
  }

  /**
   * Find and return a category id if the name is provided
   * and is a valid name in the database!
   * @param {string} name The category name
   * @returns {number|null} The category id or null
   */
  static async getCategoryId(name) {
    const categoryFriendly = await Helpers.friendlyUrl(name);
    const category = await Category.findBy("friendly_url", categoryFriendly);

    if (category !== null && category !== undefined) return category.id;

    return null;
  }
}

module.exports = ProductImport;

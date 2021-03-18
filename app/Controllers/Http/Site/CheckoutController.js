/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */

"use strict";

const User = use("App/Models/User");
const UserAddress = use("App/Models/UserAddress");
const ProductInventory = use("App/Models/ProductInventory");
const ProductGallery = use("App/Models/ProductGallery");
const Product = use("App/Models/Product");
const Resource = use("App/Models/Order");
const Coupon = use("App/Models/Coupon");
const ResourceItems = use("App/Models/OrderItem");
const ProductService = use("App/Services/ProductService");
const Event = use("Event");
const Helper = use("App/Helpers");
const MercadoPagoSdk = require("mercadopago");

// Mercadopago service
const MPCustomer = use("App/Services/Mercadopago/Customer");
const MPPayment = use("App/Services/Mercadopago/Payment");
const MercadoPagoConfiguration = use(
  "App/Models/ApplicationMercadoPagoConfiguration"
);

class CheckoutController {
  async getConfig() {
    const config = await MercadoPagoConfiguration.first();
    return config;
  }

  async webhook({ request }) {
    // TODO
    // Check if the request is comming from correct application_id
    try {
      const req = request.all();
      const { action, type } = req;

      if (type === "payment") {
        const { id } = req.data;
        const mpOrder = await MPPayment.show(id);
        const marketplaceOrder = await Resource.findBy("mp_payment_id", id);
        const user = await User.find(marketplaceOrder.user_id);
        const coupon = await Coupon.find(marketplaceOrder.coupon_id);
        const address = await UserAddress.find(marketplaceOrder.address_id);
        const items = await ResourceItems.query()
          .where("order_id", marketplaceOrder.id)
          .with("inventory")
          .fetch();
        const orderItems = await this.orderItems(marketplaceOrder);
        if (action === "payment.created" || action === "payment.updated") {
          if (
            action === "payment.created" &&
            mpOrder.payment_type_id === "credit_card"
          ) {
            if (mpOrder.status === "approved") {
              // Send mail to client
              Event.fire(
                "order::approved",
                marketplaceOrder,
                orderItems,
                user,
                coupon,
                address
              );
              // Send mail to adm
              Event.fire("order::notifyApproved", marketplaceOrder);
            } else if (
              mpOrder.status === "canceled" ||
              mpOrder.status === "rejected"
            ) {
              const findOrder = await Resource.find(marketplaceOrder.id);
              const itemsRowsRelation = await findOrder.items().fetch();
              const payload = itemsRowsRelation.toJSON();

              (async () => {
                for (let i = 0; i < payload.length; i++) {
                  const inventoryId = payload[i].inventory_id;
                  const inventory = await ProductInventory.find(inventoryId);
                  await ProductInventory.query()
                    .where("id", inventoryId)
                    .update({
                      inventory: parseInt(
                        inventory.inventory + payload[i].quantity,
                        10
                      ),
                      sold: parseInt(inventory.sold - payload[i].quantity, 10),
                    });
                }
              })();

              // Send mail to client
              Event.fire(
                "order::canceled",
                marketplaceOrder,
                orderItems,
                user,
                coupon,
                address
              );
              // Send mail to adm
              Event.fire("order::notifyCanceled", marketplaceOrder);
            }
          }
          if (action === "payment.updated") {
            if (mpOrder.status === "approved") {
              // Send mail to client
              Event.fire(
                "order::approved",
                marketplaceOrder,
                items.rows,
                user,
                coupon,
                address
              );
              // Send mail to adm
              Event.fire("order::notifyApproved", marketplaceOrder);
            } else if (
              mpOrder.status === "canceled" ||
              mpOrder.status === "rejected"
            ) {
              const findOrder = await Resource.find(marketplaceOrder.id);
              const itemsRowsRelation = await findOrder.items().fetch();
              const payload = itemsRowsRelation.toJSON();

              (async () => {
                for (let i = 0; i < payload.length; i++) {
                  const inventoryId = payload[i].inventory_id;
                  const inventory = await ProductInventory.find(inventoryId);
                  await ProductInventory.query()
                    .where("id", inventoryId)
                    .update({
                      inventory: parseInt(
                        inventory.inventory + payload[i].quantity,
                        10
                      ),
                      sold: parseInt(inventory.sold - payload[i].quantity, 10),
                    });
                }
              })();

              // Send mail to client
              Event.fire(
                "order::canceled",
                marketplaceOrder,
                items.rows,
                user,
                coupon,
                address
              );
              // Send mail to adm
              Event.fire("order::notifyCanceled", marketplaceOrder);
            }
          }
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  }

  async createOrder(request, auth, paymentType) {
    MercadoPagoSdk.configurations.setAccessToken(this.getConfig().secret_key);
    const req = request;
    const user = await auth.getUser();
    const { items, coupon: couponData } = req;
    const shipmentValue = req.shipment.value;
    const coupon = await ProductService.getCoupon(couponData);
    const total = await ProductService.getTotal(items, coupon, shipmentValue);
    const totalWithoutShipment = await ProductService.getTotal(items, coupon);

    const d = new Date();
    const getTime = d.getTime();
    const uniqueToken = (await Helper.generateCharacteres(35)) + getTime;

    const order = await Resource.create({
      user_id: user.id,
      amount: total,
      coupon_id: coupon !== null ? coupon.id : null,
      coupon_code: coupon !== null ? coupon.code : null,
      coupon_value: await ProductService.getDiscount(
        totalWithoutShipment,
        coupon
      ),
      payment_type: paymentType,
      fees: 0,
      shipment_value: req.shipment.value,
      shipment_service: req.shipment.code,
      address_id: req.addrId,
      installments_qty:
        paymentType === "billet"
          ? 1
          : parseInt(req.creditCard.installments.split("|")[1], 10),
      installment_amount:
        paymentType === "billet"
          ? total
          : parseFloat(req.creditCard.installments.split("|")[0], 10),
      status: "created",
      unique_token: `RANDON_${uniqueToken}`,
    });

    for (let i = 0; i < items.length; i++) {
      let index;

      if (
        items[i].color_id &&
        items[i].color.price !== 0 &&
        items[i].color.price !== null
      )
        index = "color";
      else if (
        items[i].size_id &&
        items[i].size.price !== 0 &&
        items[i].size.price !== null
      )
        index = "size";
      else index = "product";

      const itemPrice = parseFloat(
        await ProductService.getPrice(items[i], index)
      );

      await ResourceItems.create({
        order_id: order.id,
        inventory_id: items[i].id,
        quantity: items[i].qty,
        price: itemPrice,
      });
    }

    const findOrder = await Resource.find(order.id);
    const itemsRowsRelation = await findOrder.items().fetch();
    const payload = itemsRowsRelation.toJSON();

    (async () => {
      for (let i = 0; i < payload.length; i++) {
        const inventoryId = payload[i].inventory_id;
        const inventory = await ProductInventory.find(inventoryId);
        await ProductInventory.query()
          .where("id", inventoryId)
          .update({
            inventory: parseInt(inventory.inventory - payload[i].quantity, 10),
            sold: parseInt(inventory.sold + payload[i].quantity, 10),
          });
      }
    })();

    await order.loadMany({
      "items.inventory.product.imageCover": null,
      "items.inventory.size": null,
      "items.inventory.color": null,
    });

    return order;
  }

  async orderItems(order) {
    const items = await ResourceItems.query()
      .select(
        "products.model",
        "order_items.price",
        "order_items.quantity",
        "product_inventories.size_id",
        "product_inventories.color_id",
        "product_inventories.product_id",
        "product_sizes.name as sizeName",
        "product_colors.name as colorName",
        "product_galleries.media_id"
      )
      .innerJoin(
        "product_inventories",
        "order_items.inventory_id",
        "product_inventories.id"
      )
      .innerJoin("products", "product_inventories.product_id", "products.id")
      .leftJoin(
        "product_sizes",
        "product_inventories.size_id",
        "product_sizes.id"
      )
      .leftJoin(
        "product_colors",
        "product_inventories.color_id",
        "product_colors.id"
      )
      .leftJoin("product_galleries", function () {
        this.on("products.id", "product_galleries.product_id");
        this.on("product_galleries.is_cover", 1);
      })
      .where("order_id", order.id)
      .fetch();

    return items;
  }

  async creditCard({ request, response, auth }) {
    const req = request.all().data;
    const { items, userId } = req;
    const user = await auth.getUser();
    const address = await UserAddress.find(req.addrId);

    if (user.user_id === null && userId !== null && userId !== undefined) {
      const reselerRef = await User.findBy("nickname", userId);

      if (reselerRef !== null) {
        await User.query().where("id", user.id).update({
          user_id: reselerRef.id,
        });
      }
    }

    /** ------------------------------------------------------------------------
     * FIRST OF ALL, WE CREATE OR UPDATE THE MERCADOPAGO CUSTOMER
     * -----------------------------------------------------------------------*/
    const payloadCustomer = {
      email: user.email,
      first_name: user.name,
      last_name: user.last_name,
      phone: {
        area_code: String(user.phone).substring(0, 2),
        number: String(user.phone).substring(2),
      },
      identification: {
        type: "CPF",
        number: String(user.cpf).padStart(11, 0),
      },
      address: {
        id: String(address.id),
        zip_code: String(address.zip_code),
        street_name: address.public_place,
        street_number: Number(address.public_place_number),
      },
    };

    // Fire the create method
    const mpCustomer = await MPCustomer.create(payloadCustomer, user);

    /** ------------------------------------------------------------------------
     * NOW LET'S CREATE THE PAYMENT
     * -----------------------------------------------------------------------*/
    // Create internal order
    const order = await this.createOrder(req, auth, "credit_card");

    // Coupom
    const coupon = await ProductService.getCoupon(req.coupon);

    // Associate items to order
    const orderItems = await this.orderItems(order);

    // const coupon = await ProductService.getCoupon(request.all().coupon);
    const total = await ProductService.getTotal(
      items,
      coupon,
      req.shipment.value
    );

    const totalWithoutShipment = await ProductService.getTotal(items, coupon);

    // Formatted items for mercadopago API
    const mpItems = await this.setMpItems(items);
    const couponDiscount = await ProductService.getDiscount(
      totalWithoutShipment,
      coupon
    );

    let payerCpf = String(user.cpf).padStart(11, 0);

    if (req.creditCard.ccOthers.thirdPart) {
      const cpfNum = Helper.toNumber(req.creditCard.ccOthers.cpf);

      payerCpf = String(cpfNum).padStart(11, 0);
    }

    const payerAddress = {
      zip_code: String(address.zip_code),
      street_name: address.public_place,
      street_number: Number(address.public_place_number),
    };

    if (req.creditCard.ccOthers.differentAddress) {
      const zipCodeNum = await Helper.toNumber(
        req.creditCard.ccOthers.address.zipCode
      );
      payerAddress.zip_code = String(zipCodeNum).padStart(8, "0");
      payerAddress.street_name = req.creditCard.ccOthers.address.publicPlace;
      payerAddress.street_number = Number(
        req.creditCard.ccOthers.address.publicPlaceNumber
      );
    }

    const payloadPayment = {
      type: "creditCard",
      token: req.token,
      installments: parseInt(req.creditCard.installments.split("|")[1], 10),
      amount: parseFloat(parseFloat(total).toFixed(2)),
      description: `Pedido nº #${order.id}`,
      method_id: req.paymentMethodId,
      coupon_amount: parseFloat(parseFloat(couponDiscount).toFixed(2)),
      payer: {
        info: {
          email: user.email,
          first_name: user.name,
          last_name: user.last_name,
          created_at: user.created_at,
        },
        address: payerAddress,
        identification: {
          number: payerCpf,
          type: "CPF",
        },
        phone: {
          area_code: String(user.phone).substring(0, 2),
          number: String(user.phone).substring(2),
        },
        receiver_address: {
          zip_code: String(address.zip_code).padStart(8, "0"),
          street_name: address.public_place,
          street_number: Number(address.public_place_number),
          city_name: String(address.city),
          state_name: String(address.state),
        },
      },
      external_reference: order.unique_token,
      statement_descriptor: process.env.APP_NAME,
      additional_info: {
        items: mpItems,
      },
    };

    await MPPayment.create(payloadPayment, order.id, user, mpCustomer);

    (async () => {
      for (let i = 0; i < orderItems.length; i++) {
        const inventoryId = orderItems[i].inventory_id;
        const inventory = await ProductInventory.find(inventoryId);

        await ProductInventory.query()
          .where("id", inventoryId)
          .update({
            inventory: parseInt(
              inventory.inventory - orderItems[i].quantity,
              10
            ),
            sold: parseInt(inventory.sold + orderItems[i].quantity, 10),
          });
      }
    })();

    const orderUpdated = await Resource.find(order.id);

    // Notify user
    Event.fire(
      "order::storeCreditCard",
      orderUpdated,
      orderItems,
      user,
      coupon
    );

    Event.fire("order::notifyWithdrawInHands", orderUpdated, user, coupon);

    return response.status(202).json({
      data: {
        message: "Seu pedido foi registrado com sucesso",
        order,
      },
    });
  }

  async setMpItems(items) {
    const mpItems = [];

    for (let i = 0; i < items.length; i++) {
      let index;

      if (
        items[i].color_id &&
        items[i].color.price !== 0 &&
        items[i].color.price !== null
      )
        index = "color";
      else if (
        items[i].size_id &&
        items[i].size.price !== 0 &&
        items[i].size.price !== null
      )
        index = "size";
      else index = "product";

      const inventory = await ProductInventory.find(items[i].id);
      const product = await Product.find(inventory.product_id);
      const productImage = await ProductGallery.query()
        .where("product_id", product.id)
        .andWhere("is_cover", 1)
        .first();

      mpItems.push({
        id: String(items[i].id),
        title: product.model,
        description:
          product.headline !== null && product.headline !== undefined
            ? String(product.headline)
            : "",
        picture_url: `${productImage.media_id}`,
        category_id:
          product.category_id !== null && product.category_id !== undefined
            ? String(product.category_id)
            : "",
        quantity: Number(items[i].qty),
        unit_price: await ProductService.getPrice(items[i], index),
      });
    }

    return mpItems;
  }

  /**
   * Pay with billet
   *
   * @param {Object} request
   * @param {Object} response
   * @param {App/Models/User} auth
   */
  async billet({ request, response, auth }) {
    const req = request.all().data;
    const { items, userId } = req;
    const user = await auth.getUser();
    const address = await UserAddress.find(req.addrId);

    if (user.user_id === null && userId !== null && userId !== undefined) {
      const reselerRef = await User.findBy("nickname", userId);

      if (reselerRef !== null) {
        await User.query().where("id", user.id).update({
          user_id: reselerRef.id,
        });
      }
    }

    /** ------------------------------------------------------------------------
     * FIRST OF ALL, WE CREATE OR UPDATE THE MERCADOPAGO CUSTOMER
     * -----------------------------------------------------------------------*/
    const payloadCustomer = {
      email: user.email,
      first_name: user.name,
      last_name: user.last_name,
      phone: {
        area_code: String(user.phone).substring(0, 2),
        number: String(user.phone).substring(2),
      },
      identification: {
        type: "CPF",
        number: String(user.cpf).padStart(11, 0),
      },
      address: {
        id: String(address.id),
        zip_code: String(address.zip_code),
        street_name: address.public_place,
        street_number: Number(address.public_place_number),
      },
    };

    // Fire the create method
    const mpCustomer = await MPCustomer.create(payloadCustomer);

    /** ------------------------------------------------------------------------
     * NOW LET'S CREATE THE PAYMENT
     * -----------------------------------------------------------------------*/
    // Create internal order
    const order = await this.createOrder(req, auth, "billet");

    // Coupom
    const coupon = await ProductService.getCoupon(req.coupon);

    // Associate items to order
    const orderItems = await this.orderItems(order);

    // const coupon = await ProductService.getCoupon(request.all().coupon);
    const total = await ProductService.getTotal(
      items,
      coupon,
      req.shipment.value
    );

    const totalWithoutShipment = await ProductService.getTotal(items, coupon);

    // Formatted items for mercadopago API
    const mpItems = await this.setMpItems(items);
    const couponDiscount = await ProductService.getDiscount(
      totalWithoutShipment,
      coupon
    );

    const payloadPayment = {
      type: "billet",
      installments: 1,
      amount: parseFloat(parseFloat(total).toFixed(2)),
      description: `Pedido nº #${order.id}`,
      method_id: "bolbradesco",
      coupon_amount: parseFloat(parseFloat(couponDiscount).toFixed(2)),
      payer: {
        info: {
          email: user.email,
          first_name: user.name,
          last_name: user.last_name,
        },
        address: {
          zip_code: String(address.zip_code),
          street_name: address.public_place,
          street_number: Number(address.public_place_number),
        },
        identification: {
          number: String(user.cpf).padStart(11, 0),
          type: "CPF",
        },
        phone: {
          area_code: String(user.phone).substring(0, 2),
          number: String(user.phone).substring(2),
        },
        receiver_address: {
          zip_code: String(address.zip_code).padStart(8, 0),
          street_name: address.public_place,
          street_number: Number(address.public_place_number),
          city_name: address.city,
          state_name: address.state,
        },
      },
      external_reference: order.unique_token,
      statement_descriptor: process.env.APP_NAME,
      additional_info: {
        items: mpItems,
      },
    };

    (async () => {
      for (let i = 0; i < orderItems.length; i++) {
        const inventoryId = orderItems[i].inventory_id;
        const inventory = await ProductInventory.find(inventoryId);

        await ProductInventory.query()
          .where("id", inventoryId)
          .update({
            inventory: parseInt(
              inventory.inventory - orderItems[i].quantity,
              10
            ),
            sold: parseInt(inventory.sold + orderItems[i].quantity, 10),
          });
      }
    })();

    await MPPayment.create(payloadPayment, order.id, user, mpCustomer);

    const orderUpdated = await Resource.find(order.id);

    Event.fire("order::storeBillet", orderUpdated, orderItems, user, coupon);
    Event.fire("order::notifyWithdrawInHands", orderUpdated, user, coupon);

    return response.status(202).json({
      data: {
        message: "Seu pedido foi registrado com sucesso",
        order,
      },
    });
  }

  /**
   * Finish order by withdrow in hands
   *
   * @param {*} param0
   */
  async finish({ request, response, auth }) {
    const req = request.all().data;
    const user = await auth.getUser();
    const { items, userId } = req;
    const coupon = await ProductService.getCoupon(req.coupon);
    const total = await ProductService.getTotal(items, coupon, 0);
    const d = new Date();
    const getTime = d.getTime();
    const uniqueToken = (await Helper.generateCharacteres(35)) + getTime;

    if (user.user_id === null && userId !== null && userId !== undefined) {
      const reselerRef = await User.findBy("nickname", userId);

      if (reselerRef !== null) {
        await User.query().where("id", user.id).update({
          user_id: reselerRef.id,
        });
      }
    }

    const order = await Resource.create({
      user_id: user.id,
      amount: total,
      coupon_id: coupon !== null ? coupon.id : null,
      coupon_code: coupon !== null ? coupon.code : null,
      coupon_value: await ProductService.getDiscount(total, coupon),
      payment_type: "cash",
      fees: 0,
      shipment_value: 0,
      installments_qty: 1,
      installment_amount: total,
      status: "created",
      unique_token: `RANDON_${uniqueToken}`,
    });

    for (let i = 0; i < items.length; i++) {
      let index;

      if (
        items[i].color_id &&
        items[i].color.price !== 0 &&
        items[i].color.price !== null
      )
        index = "color";
      else if (
        items[i].size_id &&
        items[i].size.price !== 0 &&
        items[i].size.price !== null
      )
        index = "size";
      else index = "product";

      await ResourceItems.create({
        order_id: order.id,
        inventory_id: items[i].id,
        quantity: items[i].qty,
        price: await ProductService.getPrice(items[i], index),
      });
    }

    const orderItems = await this.orderItems(order);

    Event.fire("order::storeWithdrawInHands", order, orderItems, user, coupon);
    Event.fire("order::notifyWithdrawInHands", order, user, coupon);

    await order.loadMany({
      "items.inventory.product.imageCover": null,
      "items.inventory.size": null,
      "items.inventory.color": null,
    });

    return response.status(202).json({
      data: {
        message: "Seu pedido foi registrado com sucesso",
        order,
      },
    });
  }

  async show({ params, response }) {
    const { token } = params;
    const order = await Resource.findBy("unique_token", token);

    if (order === null) {
      return response.status(403).json({
        data: {
          message: "Não foi possível identificar o pedido solicitado",
        },
      });
    }

    await order.loadMany({
      "items.inventory.product.imageCover": null,
      "items.inventory.size": null,
      "items.inventory.color": null,
    });

    return {
      data: {
        resource: order,
      },
    };
  }
}

module.exports = CheckoutController;

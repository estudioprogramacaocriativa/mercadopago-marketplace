/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */

"use strict";

const Coupon = use("App/Models/Coupon");

class ProductService {
  /**
   * Get product price
   *
   * @param {*} item
   */
  static getPrice(item, index) {
    const hasPromotionalValue = this.hasPromotionalPrice(item[index]);

    if (hasPromotionalValue) return item[index].promotional_price;
    return item[index].price;
  }

  /**
   * Get order total
   *
   * @param {*} items
   * @param {*} coupomId
   * @param {*} shipmentValue
   */
  static async getTotal(items, coupomData = null, shipmentValue) {
    const sum = items.reduce((accumulator, el) => {
      let index;

      if (el.color_id && el.color.price !== 0 && el.color.price !== null)
        index = "color";
      else if (el.size_id && el.size.price !== 0 && el.size.price !== null)
        index = "size";
      else index = "product";

      const amountTotal = this.getPrice(el, index) * el.qty;

      return accumulator + amountTotal;
    }, 0);

    const discount = await this.getDiscount(sum, coupomData);
    const total = sum + shipmentValue - discount;

    return total;
  }

  /**
   * Check if product has promotional price
   *
   * @param {*} obj
   */
  static hasPromotionalPrice(obj) {
    const { price } = obj;
    const promotionalPrice = obj.promotional_price;
    const promotionalStart = obj.promotional_start;
    const promotionalEnd = obj.promotional_end;
    const now = new Date();

    if (
      promotionalPrice > price ||
      promotionalPrice === null ||
      promotionalPrice === undefined ||
      promotionalPrice === 0 ||
      promotionalPrice === "0" ||
      promotionalPrice === ""
    )
      return false;

    if (promotionalStart !== null && new Date(promotionalStart) > now)
      return false;

    if (promotionalEnd !== null && new Date(promotionalEnd) <= now)
      return false;

    return true;
  }

  /**
   * Get discount
   *
   * @param {*} coupomId
   */
  static async getDiscount(total, couponData = null) {
    let discount = 0;

    if (couponData !== null) {
      const coupon = await this.getCoupon(couponData);

      if (coupon !== null) {
        if (coupon.type === "fix") discount = coupon.value;
        else discount = await this.percentage(coupon.value, total);
      }
    }

    return discount;
  }

  /**
   * Get coupon
   *
   * @param {*} couponId
   */
  static getCoupon(couponData = null) {
    if (couponData !== null) {
      const coupon = Coupon.findBy("code", couponData.code);

      return coupon;
    }

    return null;
  }

  /**
   * Get percentual
   *
   * @param {*} partial
   * @param {*} total
   */
  static percentage(partial, total) {
    return (partial / 100) * total; // .toFixed(2)
  }
}

module.exports = ProductService;

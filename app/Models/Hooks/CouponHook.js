'use strict';

const CouponHook = (exports = module.exports = {});
const Helpers = use('App/Helpers');

CouponHook.setStatus = instance => {
  if (
    instance.status === undefined ||
    instance.status === 'undefined' ||
    !instance.status ||
    instance.status === 'false'
  )
    instance.status = 'inactive';
};

CouponHook.formatValue = async (instance) => {
  if (instance.value) {
    instance.value = await Helpers.decimalToDatabase(instance.value);
  }
};

CouponHook.formatDates = async (instance) => {
  if (instance.start_date) {
    instance.start_date = await Helpers.dateToDatabase(
      instance.start_date,
      true
    );
  }

  if (instance.end_date) {
    instance.end_date = await Helpers.dateToDatabase(instance.end_date, true);
  }
};

CouponHook.uppercaseString = instance => {
  if (instance.code) {
    instance.code = instance.code.toUpperCase();
  }
};

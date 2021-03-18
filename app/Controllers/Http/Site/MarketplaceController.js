"use strict";

const Marketplace = use("App/Models/ApplicationMercadoPagoConfiguration");

class MarketplaceController {
  async configuration() {
    const resource = await Marketplace.first();

    return {
      data: {
        resource,
      },
    };
  }
}

module.exports = MarketplaceController;

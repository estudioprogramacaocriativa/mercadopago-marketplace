"use strict";

const Route = use("Route");

// Authentication group routes
Route.group(() => {
  Route.post("session", "SessionController.store").validator("Session");
  Route.post("logout", "SessionController.logout");
  Route.post("session/token/refresh", "SessionController.refresh").validator(
    "Token"
  );
  Route.post("register", "RegisterController.store").validator("Register");
  Route.post("password/email", "PasswordResetController.store").validator(
    "PasswordEmail"
  );
  Route.patch(
    "password/change/:token?",
    "ChangePasswordController.change"
  ).validator("PasswordChange");
  Route.get("confirm-email", "ConfirmEmailController.show");
  Route.put("confirm-email", "ConfirmEmailController.update");
})
  .namespace("Auth")
  .prefix("auth");

Route.get("users/me", "SessionController.show")
  .namespace("Auth")
  .middleware("auth");

// Validate group routes
Route.group(() => {
  Route.post("exists/email", "ValidateController.existEmail");
  Route.post("exists/document", "ValidateController.existDocument");
  Route.post("exists/phone", "ValidateController.existPhone");
  Route.post("is-valid/document", "ValidateController.isValidDocument");
}).prefix("validate");

// // Mercadopago
// Route.group(() => {
//   // Customers
//   Route.post("customers", "Mercadopago/CustomerController.store");
//   Route.delete("customers/:id", "Mercadopago/CustomerController.delete");

//   // Payments
//   Route.get("payments", "Mercadopago/PaymentController.index");
//   Route.put("payments", "Mercadopago/PaymentController.updateStatus");
//   Route.post("payments", "Mercadopago/PaymentController.store");
//   Route.delete("payments/:id", "Mercadopago/PaymentController.show");
// }).prefix("mercadopago");

// Site group routes
Route.group(() => {
  Route.get("product", "ProductController.index");
  Route.get("product/show/:name?", "ProductController.show");
  Route.get("product/home", "ProductController.home");
  Route.get("product/best-seller", "ProductController.bestSeller");
  Route.get("product/related", "ProductController.related");
  Route.get("product/category", "ProductCategoryController.index");
  Route.get("media/url/:path?", "MediaController.show");
  Route.get("media/path/:id", "MediaController.getPath");
  Route.get("cart/item/:id?", "CartController.show");
  Route.post("cart/coupon", "CouponController.show");
  Route.get("user/show", "UserController.show");
  Route.put("user/update", "UserController.update").validator(
    "CheckoutProfile"
  );
  Route.post("reseler", "ReselerController.store").validator("Reseler");
  Route.get("slide", "SlideController.index");
  Route.get("layout", "LayoutController.show");

  // Order
  Route.get("order", "OrderController.index");
  Route.get("order/:id", "OrderController.show");

  // Checkout
  Route.post("checkout/finish", "CheckoutController.finish");
  Route.get("checkout/show/:token", "CheckoutController.show");
  Route.post("checkout/billet", "CheckoutController.billet");
  Route.post("checkout/creditCard", "CheckoutController.creditCard");
  Route.post("checkout/webhook", "CheckoutController.webhook");

  Route.post("contact", "ContactController.store").validator("Contact");
  Route.post("newsletter", "NewsletterController.store").validator(
    "Newsletter"
  );

  Route.get(
    "application/configuration",
    "ApplicationConfigurationController.show"
  );
  Route.get("user/:userId/address", "UserAddressController.index");
  Route.get("user/address/:id", "UserAddressController.show");
  Route.delete("user/:userId/address/:id", "UserAddressController.destroy");
  Route.post("user/:userId/address", "UserAddressController.store").validator(
    "UserAddress"
  );
  Route.put(
    "user/:userId/address/:id",
    "UserAddressController.update"
  ).validator("UserAddress");

  Route.get("marketplace/configuration", "MarketplaceController.configuration");
})
  .namespace("Site")
  .prefix("site");

// Profile manager
Route.group(() => {
  Route.put("personal", "Profile/UserProfileController.update").validator(
    "Profile"
  );
  Route.put("access", "Profile/UserAccessController.update").validator(
    "Access"
  );
  Route.put("address", "Profile/UserAddressController.update").validator(
    "UserAddress"
  );
  Route.put("file", "Profile/UserFileController.update").validator("UserFile");
})
  .prefix("adm/profile")
  .middleware("auth");

Route.group(() => {
  Route.patch("users/:userId/thumb", "UserThumbController.update");
})
  .namespace("Profile")
  .prefix("adm")
  .middleware("auth");

// Master access group routes
Route.group(() => {
  Route.get(
    "marketplace/mercadopago-payment-preference/:id",
    "MarketplaceController.getMpPaymentPreference"
  );
  Route.get(
    "marketplace/mercadopago-configuration",
    "MarketplaceController.mercadoPagoConfigurations"
  );
  Route.get("marketplace/configuration", "MarketplaceController.configuration");
  Route.post("marketplace/authorize", "MarketplaceController.authorization");
  Route.get(
    "marketplace/check-authorization",
    "MarketplaceController.checkAuthorization"
  );
  Route.post("users/:userId/address", "UserAddressController.store").validator(
    "UserAddress"
  );
  Route.put("users/:userId/address", "UserAddressController.update").validator(
    "UserAddress"
  );
  Route.post("users/:userId/file", "UserFileController.store").validator(
    "UserFile"
  );
  Route.put("users/:userId/file", "UserFileController.update").validator(
    "UserFile"
  );

  Route.resource("users/contact", "ContactController").apiOnly();
  Route.resource("users", "UserController")
    .validator(
      new Map([
        ["users.store", "User"],
        ["users.update", "UserUpdate"],
      ])
    )
    .apiOnly();

  Route.resource("products/categories", "ProductCategoryController")
    .validator(
      new Map([
        ["products/categories.store", "ProductCategory"],
        ["products/categories.update", "ProductCategory"],
      ])
    )
    .apiOnly();

  Route.post("products/gallery", "ProductImportGalleryController.store");
  Route.post("products/import", "ProductImportController.handle").validator(
    "ProductImport"
  );
  Route.delete("products/size/:id", "ProductSizeController.destroy");
  Route.delete("products/color/:id", "ProductColorController.destroy");
  Route.post("products/deleteAll", "ProductController.destroyAll");
  Route.resource("products", "ProductController")
    .validator(
      new Map([
        ["products.store", "Product"],
        ["products.update", "Product"],
      ])
    )
    .apiOnly();

  Route.resource("orders", "OrderController").apiOnly();

  Route.get("media/gallery/list", "MediaController.getGallery");
  Route.resource("media", "MediaController")
    .validator(
      new Map([
        ["media.store", "Media"],
        ["media.update", "Media"],
      ])
    )
    .apiOnly();

  Route.resource("slides", "SliderController")
    .validator(
      new Map([
        ["slides.store", "Slider"],
        ["slides.update", "Slider"],
      ])
    )
    .apiOnly();

  Route.resource("sales", "SaleController").apiOnly();
  Route.resource("marketing/coupons", "CouponController")
    .validator(
      new Map([
        ["marketing/coupons.store", "Coupon"],
        ["marketing/coupons.update", "Coupon"],
      ])
    )
    .apiOnly();
  Route.resource("marketing/newsletters", "NewsletterController")
    .validator(
      new Map([
        ["marketing/newsletters.store", "Newsletter"],
        ["marketing/newsletters.update", "Newsletter"],
      ])
    )
    .apiOnly();
  Route.resource("marketing/promotions", "PromotionController").apiOnly();

  /**
   * Configurations
   */
  Route.get(
    "app/configuration/general",
    "ApplicationConfigurationController.show"
  );
  Route.put(
    "app/configuration/general",
    "ApplicationConfigurationController.update"
  );

  Route.get("app/configuration/seo", "ApplicationSeoController.show");
  Route.put("app/configuration/seo", "ApplicationSeoController.update");

  Route.get(
    "app/configuration/javascript",
    "ApplicationJavascriptController.show"
  );
  Route.put(
    "app/configuration/javascript",
    "ApplicationJavascriptController.update"
  );

  Route.get(
    "app/configuration/notifications",
    "ApplicationNotificationController.show"
  );
  Route.put(
    "app/configuration/notifications",
    "ApplicationNotificationController.update"
  );

  Route.get(
    "app/configuration/mercadopago",
    "ApplicationMercadoPagoController.show"
  );
  Route.put(
    "app/configuration/mercadopago",
    "ApplicationMercadoPagoController.update"
  );

  Route.resource("app/configuration/emails", "ApplicationEmailController")
    .validator(
      new Map([
        ["app/configuration/emails.store", "ApplicationEmail"],
        ["app/configuration/emails.update", "ApplicationEmail"],
      ])
    )
    .apiOnly();

  Route.put("layout", "LayoutController.update");
  Route.get("layout", "LayoutController.show");
})
  .namespace("Adm")
  .prefix("adm")
  .middleware("auth");

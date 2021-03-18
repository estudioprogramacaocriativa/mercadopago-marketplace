"use strict";

const Resource = use("App/Models/ApplicationNotification");

class ApplicationNotificationController {
  async show() {
    const resource = await Resource.query().first();

    return {
      data: {
        resource,
      },
    };
  }

  async update({ request }) {
    const {
      notifyWhenNewReseler,
      notifyWhenNewClient,
      notifyWhenNewAdmin,
      notifyWhenNewContact,
      notifyWhenNewNewsletter,
      notifyWhenNewOrder,
      notifyWhenOrderApproved,
      notifyWhenOrderCancelled,
      reselerEmailId,
      clientEmailId,
      adminEmailId,
      contactEmailId,
      newsletterEmailId,
    } = request.all();

    const find = await Resource.first();

    const data = {
      notify_when_new_reseler: notifyWhenNewReseler || 0,
      notify_when_new_client: notifyWhenNewClient || 0,
      notify_when_new_admin: notifyWhenNewAdmin || 0,
      notify_when_new_contact: notifyWhenNewContact || 0,
      notify_when_new_newsletter: notifyWhenNewNewsletter || 0,
      notify_when_new_order: notifyWhenNewOrder || 0,
      notify_when_order_approved: notifyWhenOrderApproved || 0,
      notify_when_order_cancelled: notifyWhenOrderCancelled || 0,
      reseler_email_id: reselerEmailId || null,
      client_email_id: clientEmailId || null,
      admin_email_id: adminEmailId || null,
      contact_email_id: contactEmailId || null,
      newsletter_email_id: newsletterEmailId || null,
    };

    if (find === null) {
      await Resource.create(data);
    } else {
      find.merge(data);
      await find.save();
    }

    return {
      data: {
        message: "As definições de notificaçõe foram atualizadas!",
      },
    };
  }
}

module.exports = ApplicationNotificationController;

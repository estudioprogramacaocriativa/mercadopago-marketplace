"use strict";

const Resource = use("App/Models/ApplicationJavascript");

class ApplicationJavascriptController {
  async show() {
    const resource = await Resource.query().first();

    let payload = null;

    if (resource) {
      payload = {
        script_head: resource.script_head,
        script_body: resource.script_body,
      };
    }

    return {
      data: {
        resource: payload,
      },
    };
  }

  async update({ request }) {
    const { scriptHead, scriptBody } = request.all();
    const find = await Resource.query().first();

    const data = {
      script_head: scriptHead,
      script_body: scriptBody,
    };

    if (find) {
      find.merge(data);
      await find.save();
    } else await Resource.create(data);

    return {
      data: {
        message: "As configurações de Javascript foram atualizadas!",
      },
    };
  }
}

module.exports = ApplicationJavascriptController;

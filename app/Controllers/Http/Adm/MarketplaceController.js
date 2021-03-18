"use strict";

const axios = use("axios");
const MarketplaceReseler = use("App/Models/MarketplaceReseler");
const AppMercadoPagoConfig = use(
  "App/Models/ApplicationMercadoPagoConfiguration"
);

class MarketplaceController {
  async getMpPaymentPreference({ params, response, auth }) {
    const { id } = params;

    const userLoggedIn = await auth.getUser();
    const mpReselerConfig = await MarketplaceReseler.query()
      .where("user_id", userLoggedIn.id)
      .first();

    if (mpReselerConfig === null || mpReselerConfig.access_token === null) {
      return response.status(400).json({
        data: {
          message: "Não foi possível obter o seu token do Mercado Pago!",
        },
      });
    }

    return axios
      .get(`https://api.mercadopago.com/checkout/preferences/${id}`, {
        headers: {
          Authorization: `Bearer ${mpReselerConfig.access_token}`,
        },
      })
      .then((res) => {
        return {
          data: {
            resource: res.data,
          },
        };
      })
      .catch(() => {
        return response.status(400).json({
          data: {
            message: "Não foi possível obter o seu token do Mercado Pago!",
          },
        });
      });
  }

  async mercadoPagoConfigurations() {
    const resource = await AppMercadoPagoConfig.first();

    return {
      data: {
        resource,
      },
    };
  }

  async configuration({ auth }) {
    const userLoggedIn = await auth.getUser();
    const resource = await MarketplaceReseler.query()
      .where("user_id", userLoggedIn.id)
      .first();

    return {
      data: {
        resource,
      },
    };
  }

  async checkAuthorization({ auth }) {
    const userLoggedIn = await auth.getUser();

    const resource = await MarketplaceReseler.findBy(
      "user_id",
      userLoggedIn.id
    );

    return {
      data: {
        resource,
      },
    };
  }

  async authorization({ response, request, auth }) {
    const { code, userId } = request.all();
    const userLoggedIn = await auth.getUser();

    if (parseInt(userId, 10) !== parseInt(userLoggedIn.id, 10)) {
      return response.status(400).json({
        data: {
          message:
            "Você está logado em uma conta diferente da qual está autorizando. Esta ação não é permitida!",
        },
      });
    }

    if (code === null || code === undefined) {
      return response.status(400).json({
        data: {
          message: "Código de autorização inválido!",
        },
      });
    }

    const mpConfigs = await AppMercadoPagoConfig.first();

    if (mpConfigs === null || mpConfigs.secret_key === null) {
      return response.status(400).json({
        data: {
          message: "Marketplace desabilitado. Contacte o administrador!",
        },
      });
    }

    const reselerOauth = {
      expires_in: "",
      refresh_token: "",
      user_id: userLoggedIn.id,
      authorization_code: code,
      access_token: "",
      public_key: "",
      mp_user_id: "",
      scope: "",
    };

    return axios
      .post(
        "https://api.mercadopago.com/oauth/token",
        {
          code,
          client_secret: mpConfigs.secret_key,
          grant_type: "authorization_code",
          redirect_uri: `${process.env.APP_WEB_ADM_URL}/app/marketplace/authorize`,
        },
        {
          headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then(async (resp) => {
        const payload = resp.data;

        reselerOauth.expires_in = payload.expires_in;
        reselerOauth.refresh_token = payload.refresh_token;
        reselerOauth.access_token = payload.access_token;
        reselerOauth.public_key = payload.public_key;
        reselerOauth.mp_user_id = payload.user_id;
        reselerOauth.scope = payload.scope;

        const findReselerConfig = await MarketplaceReseler.findBy(
          "user_id",
          userLoggedIn.id
        );

        if (findReselerConfig === null) {
          await MarketplaceReseler.create(reselerOauth);
        } else {
          await MarketplaceReseler.query()
            .where("user_id", userLoggedIn.id)
            .update(reselerOauth);
        }

        const resource = await MarketplaceReseler.findBy(
          "user_id",
          userLoggedIn.id
        );

        return response.json({
          data: {
            resource,
            message: "Sua conta foi conectada com sucesso ao nosso marketplace",
          },
        });
      })
      .catch(() => {
        return response.status(400).json({
          data: {
            message:
              "Seu acesso expirou ou sua conta já foi integrada corretamente. Verifique com o administrador",
          },
        });
      });
  }
}

module.exports = MarketplaceController;

"use strict";

const User = use("App/Models/User");

class SessionController {
  async store({ request, response, auth }) {
    try {
      const { email, password, origin, secretKey } = request.all();
      const secretNeedle = "Secret_Key_pk20200101";

      if (origin === "adm" || origin === "adminMode") {
        const user = await User.query()
          .where("email", email)
          .andWhere("role", "!=", "client")
          .first();

        if (user === null) {
          return response.status(401).json({
            data: {
              message:
                "Não foi possível localizar o " +
                "usuário com os dados informados",
            },
          });
        }
      }

      if (origin === "adminMode") {
        if (secretKey !== secretNeedle) {
          return response.status(401).json({
            data: {
              message: "Chave inválida",
            },
          });
        }
      }

      const { token } = await auth.attempt(email, password);

      if (token) {
        return response
          .header("Authorization", `Bearer ${token}`)
          .header("Access-Control-Allow-Headers", "Authorization")
          .header("Access-Control-Expose-Headers", "Authorization")
          .header("token", token)
          .json({
            data: {
              token,
              message: `Bem-vindo de volta`,
            },
          });
      }

      return {
        data: {
          message:
            "Não foi possível localizar o usuário com os dados informados",
        },
      };
    } catch (e) {
      if (e.name === "PasswordMisMatchException") {
        return response.status(400).json({
          data: {
            message: "A senha informada está incorreta!",
          },
        });
      }
      if (e.name === "UserNotFoundException") {
        return response.status(400).json({
          data: {
            message: "O e-mail informado não foi encontrado!",
          },
        });
      }

      return response.status(400).json({
        data: {
          message: e.message,
        },
      });
    }
  }

  async refreshToken({ request, response, auth }) {
    const { refresh_token: refreshToken } = request.only(["refresh_token"]);

    try {
      return await auth.newRefreshToken().generateForRefreshToken(refreshToken);
    } catch (err) {
      return response.status(401).send({
        data: {
          message: "Token inválido",
        },
      });
    }
  }

  async show({ auth, response }) {
    try {
      const authUser = await auth.getUser();
      const user = await User.query()
        .select(
          "id",
          "email",
          "name",
          "last_name",
          "birth_date",
          "phone",
          "media_id",
          "cpf",
          "status",
          "role",
          "nickname",
          "first_access_hash"
        )
        .where("id", authUser.id)
        .with("addresses")
        .with("address")
        .with("files")
        .with("orders.items")
        .first();

      return {
        data: {
          user,
        },
      };
    } catch (error) {
      return response.status(401).send({
        data: {
          message: "Token inválido",
        },
      });
    }
  }

  async logout({ auth }) {
    const refreshToken = "";

    await auth.authenticator("jwt").revokeTokens([refreshToken]);

    return {
      data: {
        message: "Você foi desconectado",
      },
    };
  }
}

module.exports = SessionController;

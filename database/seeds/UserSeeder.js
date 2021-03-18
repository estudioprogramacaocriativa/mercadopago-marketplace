"use strict";

const Database = use("Database");
const User = use("App/Models/User");

class UserSeeder {
  async run() {
    await Database.raw("SET FOREIGN_KEY_CHECKS = 0;");
    await User.truncate();
    await Database.raw("SET FOREIGN_KEY_CHECKS = 1;");

    await User.create({
      email: "dev@programacaocriativa.com.br",
      password: "12345678",
      name: "Samuel",
      role: "master",
    });
  }
}

module.exports = UserSeeder;

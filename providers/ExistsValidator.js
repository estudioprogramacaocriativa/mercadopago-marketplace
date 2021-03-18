const { ServiceProvider } = require("@adonisjs/fold");

class ExistsValidator extends ServiceProvider {
  async boot() {
    const Validator = use("Validator");
    const Database = use("Database");
    const Helpers = use("App/Helpers");

    const existsFn = async (data, field, message, args, get) => {
      let value = get(data, field);

      if (!value) return;

      const [table, column, ...rest] = args;
      const hasId = rest[1];
      const hasUserId = rest[3];

      value = await Helpers.toNumber(value);

      let row = Database.table(table).where(column, value);

      if (hasId !== undefined && hasId.replace(/\D/g, ""))
        row = row.where("id", "!=", hasId);
      if (hasUserId !== undefined) row = row.andWhere("user_id", hasUserId);

      row = await row.first();

      if (row) throw message;
    };

    Validator.extend("exists", existsFn);
  }
}

module.exports = ExistsValidator;

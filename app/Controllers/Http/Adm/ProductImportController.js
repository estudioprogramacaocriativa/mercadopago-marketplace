"use strict";

const ProductImport = use("App/Services/ProductImport");
const Helpers = use("Helpers");
const Drive = use("Drive");
const fs = use("fs");

class ProductImportController {
  async handle({ request, response }) {
    const upload = request.file("file");
    const fname = `planilha-de-produtos.${upload.extname}`;
    const dir = "medias/product/";
    const exists = await Drive.exists(Helpers.publicPath(`${dir}/${fname}`));

    if (exists) fs.unlink(Helpers.publicPath(`${dir}/${fname}`), () => {});

    await upload.move(Helpers.publicPath(dir), {
      name: fname,
    });

    if (!upload.moved()) {
      return response.status(400).json({
        data: {
          message: `Não foi possível processar o arquivo enviado. Motivo: ${upload.error()}`,
        },
      });
    }

    const send = await ProductImport.importRows(`public/${dir}${fname}`);

    return send;
  }
}

module.exports = ProductImportController;

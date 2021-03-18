/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable arrow-parens */

"use strict";

const Resource = use("App/Models/ProductGallery");
const ResourceMedia = use("App/Models/Media");
const ResourceProduct = use("App/Models/Product");
const Helpers = use("Helpers");
const Drive = use("Drive");
const fs = require("fs");

class ProductImportGalleryController {
  async store({ request, response }) {
    const images = request.file("medias");

    if (!images) {
      return response.status(403).json({
        data: {
          message:
            "Informe ao menos uma mídia imagem para realizar o upload do arquivo para a galeria",
        },
      });
    }

    const imagesArr = Array.from(images.files);

    (async () => {
      for (let i = 0; i < imagesArr.length; i++) {
        const clientFileName = imagesArr[i].clientName;
        const filename = clientFileName.split(".").slice(0, -1).join(".");
        const separateName = filename.split("-");
        const productCode =
          separateName[0] !== null ? separateName[0] : filename;
        const findProduct = await ResourceProduct.findBy("code", productCode);
        const checkPrincipal = await Resource.query()
          .where("product_id", findProduct.id)
          .where("is_cover", 1)
          .first();

        if (findProduct !== null) {
          await this.storeFile(
            imagesArr[i],
            checkPrincipal === null ? 1 : 0,
            findProduct.id
          );
        }
      }
    })();

    return {
      data: {
        message: "Suas imagens em lote, para produtos, foram processadas",
      },
    };
  }

  async storeFile(resource, principal, productId) {
    const fileName = resource.clientName;
    const filePath = `${Date.now()}-${resource.clientName}`;
    const extension = resource.extname;
    const { size, type } = resource;
    const findMedia = await ResourceMedia.findBy("name", fileName);

    if (findMedia !== null) {
      const pathToFile = Helpers.publicPath(`medias/${findMedia.path}`);
      const exists = await Drive.exists(pathToFile);

      if (exists) fs.unlink(pathToFile, () => {});

      await resource.move(Helpers.publicPath("medias"), {
        name: filePath,
      });

      findMedia.merge({
        name: fileName,
        path: filePath,
        type,
        extension,
        size,
      });

      await findMedia.save();

      const findGallery = await Resource.query()
        .where("product_id", productId)
        .where("media_id", findMedia.id)
        .first();

      if (findGallery === null) {
        await Resource.create({
          is_cover: principal,
          media_id: findMedia.id,
          product_id: productId,
        });
      } else {
        findGallery.merge({
          media_id: findMedia.id,
          is_cover: principal,
        });

        await findGallery.save();
      }
    } else {
      await resource.move(Helpers.publicPath("medias"), {
        name: filePath,
      });

      if (resource.moved()) {
        const media = await ResourceMedia.create({
          name: fileName,
          path: filePath,
          extension,
          type,
          size,
        });

        await Resource.create({
          is_cover: principal,
          media_id: media.id,
          product_id: productId,
        });
      }
    }
  }
}

module.exports = ProductImportGalleryController;

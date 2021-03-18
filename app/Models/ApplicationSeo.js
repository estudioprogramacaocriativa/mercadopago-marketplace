'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class ApplicationSeo extends Model {
  static get table() {
    return 'application_seo';
  }
}

module.exports = ApplicationSeo;

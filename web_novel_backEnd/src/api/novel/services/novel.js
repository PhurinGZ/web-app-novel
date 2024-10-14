'use strict';

/**
 * novel service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::novel.novel');

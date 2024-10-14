'use strict';

/**
 * list-novel service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::list-novel.list-novel');

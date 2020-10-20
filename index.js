/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @module @admin-bro/sequelize
 * @subcategory Adapters
 * @section modules
 *
 * @description
 * ### A Sequelize database adapter for AdminBro.
 *
 * #### Installation
 *
 * To install the adapter run
 *
 * ```
 * yarn add @admin-bro/sequelize
 * ```
 *
 * ### Usage
 *
 * In order to use it in your project register the adapter first:
 *
 * ```javascript
 * const AdminBro = require('admin-bro')
 * const AdminBroSequelize = require('@admin-bro/sequelize')
 *
 * AdminBro.registerAdapter(AdminBroSequelize)
 * ```
 *
 * ### Passing an entire database
 *
 * Sequelize generates folder in your app called `./models` and there is an `index.js` file.
 * You can require it and pass to {@link AdminBroOptions} like this:
 *
 * ```javascript
 * const db = require('../models');
 * const AdminBro = new AdminBro({
 *   databases: [db],
 *   //... other AdminBroOptions
 * })
 * //...
 * ```
 *
 * ### Passing each resource
 *
 * Also you can pass a single resource and adjust it to your needs via {@link ResourceOptions}.
 *
 * So let say you have a model called `vendor` and there is a `vendor.js` file in your `./models`.
 * Within this file there is
 *
 * ```javascript
 * //...
 * sequelize.define('vendor', //...
 * //...
 * ```
 *
 * In order to pass it directly, run this code:
 *
 * ```javascript
 * const db = require('../models');
 * const AdminBro = new AdminBro({
 *   databases: [db], // you can still load an entire database and adjust just one resource
 *   resources: [{
 *     resource: db.vendor,
 *     options: {
 *       //...
 *     }
 *   }]
 * })
 * //...
 * ```
 *
 *
 */

/**
 * Implementation of {@link BaseDatabase} for Sequelize Adapter
 *
 * @memberof module:@admin-bro/sequelize
 * @type {typeof BaseDatabase}
 * @static
 */
const Database = require('./build/database').default

/**
 * Implementation of {@link BaseResource} for Sequelize Adapter
 *
 * @memberof module:@admin-bro/sequelize
 * @type {typeof BaseResource}
 * @static
 */
const Resource = require('./build/resource').default

module.exports = { Database, Resource }

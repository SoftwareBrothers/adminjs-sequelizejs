/**
 * @module @adminjs/sequelize
 * @subcategory Adapters
 * @section modules
 *
 * @description
 * ### A Sequelize database adapter for AdminJS.
 *
 * #### Installation
 *
 * To install the adapter run
 *
 * ```
 * yarn add @adminjs/sequelize
 * ```
 *
 * ### Usage
 *
 * In order to use it in your project register the adapter first:
 *
 * ```javascript
 * const AdminJS = require('adminjs')
 * const AdminJSSequelize = require('@adminjs/sequelize')
 *
 * AdminJS.registerAdapter(AdminJSSequelize)
 * ```
 *
 * ### Passing an entire database
 *
 * Sequelize generates folder in your app called `./models` and there is an `index.js` file.
 * You can require it and pass to {@link AdminJSOptions} like this:
 *
 * ```javascript
 * const db = require('../models');
 * const AdminJS = new AdminJS({
 *   databases: [db],
 *   //... other AdminJSOptions
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
 * const AdminJS = new AdminJS({
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
 * @memberof module:@adminjs/sequelize
 * @type {typeof BaseDatabase}
 * @static
 */
import Database from './database.js';

/**
 * Implementation of {@link BaseResource} for Sequelize Adapter
 *
 * @memberof module:@adminjs/sequelize
 * @type {typeof BaseResource}
 * @static
 */
import Resource from './resource.js';

export { default as Database } from './database.js';
export { default as Resource } from './resource.js';
export * from './utils/index.js';

export default { Database, Resource };

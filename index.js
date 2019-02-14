/**
 * @module admin-bro-sequelizejs
 *
 * @description
 * A Sequelize database adapter for AdminBro.
 */

/**
 * @type {typeof BaseDatabase}
 * @static
 */
const Database = require('./src/database')

/**
 * @type {typeof BaseResource}
 * @static
 */
const Resource = require('./src/resource')

module.exports = { Database, Resource }

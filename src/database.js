const { BaseDatabase } = require('admin-bro')
const Resource = require('./resource')

class Database extends BaseDatabase {
  static isAdapterFor(database) {
    return (database.sequelize
            && database.sequelize.constructor.name === 'Sequelize')
           || database.constructor.name === 'Sequelize'
  }

  constructor(database) {
    super()
    this.sequelize = database.sequelize || database
  }

  resources() {
    return Object.keys(this.sequelize.models).map(key => (
      new Resource(this.sequelize.models[key])
    ))
  }
}

module.exports = Database

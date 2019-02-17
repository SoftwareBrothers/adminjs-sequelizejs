/* eslint-disable no-param-reassign */

const Sequelize = require('sequelize')
const {
  BaseResource,
  BaseRecord,
  ValidationError,
} = require('admin-bro')

const Property = require('./property')
const Filters = require('./utils/filters')

const SEQUELIZE_VALIDATION_ERROR = 'SequelizeValidationError'

class Resource extends BaseResource {
  static isAdapterFor(rawResource) {
    return rawResource.prototype instanceof Sequelize.Model
  }

  constructor(SequelizeModel) {
    super(SequelizeModel)
    this.SequelizeModel = SequelizeModel
  }

  databaseName() {
    return this.SequelizeModel.sequelize.options.database
      || this.SequelizeModel.sequelize.options.host
  }

  databaseType() {
    return this.SequelizeModel.sequelize.options.dialect
  }

  name() {
    return this.SequelizeModel.tableName
  }

  id() {
    return this.SequelizeModel.tableName.toLowerCase()
  }


  properties() {
    return Object.keys(this.SequelizeModel.attributes).map(key => (
      new Property(this.SequelizeModel.attributes[key])
    ))
  }

  property(path) {
    return new Property(this.SequelizeModel.attributes[path])
  }

  async count(filters) {
    return this.SequelizeModel.count(({ where: Filters.convertedFilters(filters) }))
  }

  async find(filters = {}, { limit = 20, offset = 0, sort = {} }) {
    const { direction, sortBy } = sort
    const sequelizeObjects = await this.SequelizeModel
      .findAll({
        where: Filters.convertedFilters(filters),
        limit,
        offset,
        order: [[sortBy, direction.toUpperCase()]],
      })
    return sequelizeObjects.map(sequelizeObject => new BaseRecord(sequelizeObject.toJSON(), this))
  }

  async findOne(id) {
    const sequelizeObject = await this.SequelizeModel.findByPk(id)
    return new BaseRecord(sequelizeObject.toJSON(), this)
  }

  async create(params) {
    try {
      const record = await this.SequelizeModel.create(params)
      return record.toJSON()
    } catch (error) {
      if (error.name === SEQUELIZE_VALIDATION_ERROR) {
        throw this.createValidationError(error)
      }
      throw error
    }
  }

  async update(id, params) {
    try {
      await this.SequelizeModel.update(params, {
        where: { id },
      })
      const record = await this.SequelizeModel.findByPk(id)
      return record.toJSON()
    } catch (error) {
      if (error.name === SEQUELIZE_VALIDATION_ERROR) {
        throw this.createValidationError(error)
      }
      throw error
    }
  }

  async delete(id) {
    return this.SequelizeModel.destroy({ where: { id } })
  }

  createValidationError(originalError) {
    const errors = Object.keys(originalError.errors).reduce((memo, key) => {
      const { path, message, validatorKey } = originalError.errors[key]
      memo[path] = { message, kind: validatorKey } // eslint-disable-line no-param-reassign
      return memo
    }, {})
    return new ValidationError(`${this.name()} validation failed`, errors)
  }
}

module.exports = Resource

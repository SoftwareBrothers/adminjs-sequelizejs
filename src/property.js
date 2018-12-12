const Sequelize = require('sequelize')
const { BaseProperty } = require('admin-bro')

const TYPES_MAPPING = {}
TYPES_MAPPING[Sequelize.STRING] = 'string'
TYPES_MAPPING[Sequelize.STRING.BINARY] = 'boolean'
TYPES_MAPPING[Sequelize.TEXT] = 'string'
TYPES_MAPPING[Sequelize.INTEGER] = 'number'
TYPES_MAPPING[Sequelize.BIGINT] = 'number'
TYPES_MAPPING[Sequelize.FLOAT] = 'float'
TYPES_MAPPING[Sequelize.REAL] = 'float'
TYPES_MAPPING[Sequelize.DOUBLE] = 'float'
TYPES_MAPPING[Sequelize.DECIMAL] = 'float'
TYPES_MAPPING[Sequelize.DATE] = 'datetime'
TYPES_MAPPING[Sequelize.DATEONLY] = 'date'
TYPES_MAPPING[Sequelize.ENUM] = 'string'
TYPES_MAPPING[Sequelize.ARRAY] = 'array'
TYPES_MAPPING[Sequelize.JSON] = 'object'
TYPES_MAPPING[Sequelize.JSONB] = 'object'
TYPES_MAPPING[Sequelize.BLOB] = 'string'
TYPES_MAPPING[Sequelize.UUID] = 'string'
TYPES_MAPPING[Sequelize.CIDR] = 'string'
TYPES_MAPPING[Sequelize.INET] = 'string'
TYPES_MAPPING[Sequelize.MACADDR] = 'string'
TYPES_MAPPING[Sequelize.RANGE] = 'string'
TYPES_MAPPING[Sequelize.GEOMETRY] = 'string'


class Property extends BaseProperty {
  constructor(sequelizePath) {
    super(sequelizePath.field)
    this.sequelizePath = sequelizePath
  }

  name() {
    return this.sequelizePath.field
  }

  isEditable() {
    return !this.sequelizePath.primaryKey
  }

  isVisible() {
    // fields containing password are hidden by default
    return !this.name().match('password')
  }

  isId() {
    return this.sequelizePath.primaryKey
  }

  type() {
    const key = Object.keys(TYPES_MAPPING)
      .find(Type => this.sequelizePath.type instanceof Type)
    if (!key) {
      console.warn(`Unhandled type: ${this.sequelizePath.type}`)
    }
    return TYPES_MAPPING[key] || 'string'
  }
}

module.exports = Property

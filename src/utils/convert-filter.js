const escape = require('escape-regexp')
const {
  Op, where, fn, col,
} = require('sequelize')

const convertFilter = (filter) => {
  if (!filter) {
    return {}
  }
  return filter.reduce((memo, filterProperty) => {
    const { property, value } = filterProperty
    switch (property.type()) {
    case 'string':
      if (property.sequelizePath.values) {
        return {
          [property.name()]: { [Op.eq]: `${escape(value)}` },
          ...memo,
        }
      }
      return {
        [Op.and]: [
          where(fn('LOWER', col(property.name())), { [Op.like]: fn('LOWER', `%${escape(value)}%`) }),
        ],
        ...memo,
      }
    case 'number':
      if (!Number.isNaN(Number(value))) {
        return {
          [property.name()]: Number(value),
          ...memo,
        }
      }
      return memo
    case 'date':
    case 'datetime':
      if (value.from || value.to) {
        return {
          [property.name()]: {
            ...value.from && { [Op.gte]: value.from },
            ...value.to && { [Op.lte]: value.to },
          },
          ...memo,
        }
      }
      break
    default:
      break
    }
    return {
      [property.name()]: value,
      ...memo,
    }
  }, {})
}

module.exports = convertFilter

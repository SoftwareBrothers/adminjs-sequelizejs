const escape = require('escape-regexp')
const { Op } = require('sequelize')

const convertFilter = (filter) => {
  if (!filter) {
    return {}
  }
  return filter.reduce((memo, filterProperty) => {
    const { property, value } = filterProperty
    switch (property.type()) {
    case 'string':
      return {
        [property.name()]: { [Op.like]: `%${escape(value)}%` },
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

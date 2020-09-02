import escape from 'escape-regexp'
import {
  Op, where, fn, col,
} from 'sequelize'

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
          ...(memo[Op.and] || []),
          where(
            fn('LOWER', col(`${property.sequelizePath.Model.name}.${property.name()}`)), {
              [Op.like as unknown as string]: fn('LOWER', `%${escape(value)}%`),
            },
          ),
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

export default convertFilter

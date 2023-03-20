import escape from 'escape-regexp';
import { Op } from 'sequelize';

export const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[5|4|3|2|1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export const convertFilter = (filter) => {
  if (!filter) {
    return {};
  }
  return filter.reduce((memo, filterProperty) => {
    const { property, value, path: filterPath } = filterProperty;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, index] = filterPath.split('.');
    const isArray = typeof index !== 'undefined' && !Number.isNaN(Number(index));
    const previousValue = memo[property.name()] || {};
    switch (property.type()) {
    case 'string': {
      if (property.sequelizePath.values || uuidRegex.test(value.toString())) {
        return {
          [property.name()]: { [Op.eq]: `${escape(value)}` },
          ...memo,
        };
      }
      if (isArray) {
        return {
          ...memo,
          [property.name()]: {
            [Op.in]: [...(previousValue[Op.in] || []), escape(value)],
          },
        };
      }
      return {
        ...memo,
        [Op.and]: [
          ...(memo[Op.and] || []),
          {
            [property.name()]: {
              [(Op.like as unknown) as string]: `%${escape(value)}%`,
            },
          },
        ],
      };
    }
    case 'boolean': {
      let bool;
      if (value === 'true') bool = true;
      if (value === 'false') bool = false;
      if (bool === undefined) return memo;

      if (isArray) {
        return {
          ...memo,
          [property.name()]: {
            [Op.in]: [
              ...(previousValue[Op.in] || []),
              bool,
            ],
          },
        };
      }
      return {
        ...memo,
        [property.name()]: bool,
      };
    }
    case 'number': {
      if (!Number.isNaN(Number(value))) {
        if (isArray) {
          return {
            ...memo,
            [property.name()]: {
              [Op.in]: [...(previousValue[Op.in] || []), Number(value)],
            },
          };
        }
        return {
          [property.name()]: Number(value),
          ...memo,
        };
      }
      return memo;
    }
    case 'date':
    case 'datetime': {
      if (value.from || value.to) {
        return {
          [property.name()]: {
            ...(value.from && { [Op.gte]: value.from }),
            ...(value.to && { [Op.lte]: value.to }),
          },
          ...memo,
        };
      }
      break;
    }
    default:
      break;
    }
    if (isArray) {
      return {
        ...memo,
        [property.name()]: {
          [Op.in]: [...(previousValue[Op.in] || []), value],
        },
      };
    }
    return {
      [property.name()]: value,
      ...memo,
    };
  }, {});
};

export default convertFilter;

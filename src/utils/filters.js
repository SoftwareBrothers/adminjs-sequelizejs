/* eslint-disable no-param-reassign */

const escape = require('escape-regexp')
const Sequelize = require('sequelize')

const { Op } = Sequelize

class Filters {
  static getDateFilter({ from, to }) {
    return {
      ...from && { [Op.gte]: from },
      ...to && { [Op.lte]: to },
    }
  }

  static getDefaultFilter(filter) {
    return {
      [Op.iRegexp]: escape(filter),
    }
  }

  static convertedFilters(filters = {}) {
    return Object.keys(filters).reduce((obj, key) => {
      const currentFilter = filters[key]
      const isDateFilter = currentFilter.from || currentFilter.to
      if (isDateFilter) {
        obj[key] = Filters.getDateFilter(currentFilter)
      } else {
        obj[key] = Filters.getDefaultFilter(currentFilter)
      }
      return obj
    }, {})
  }
}

module.exports = Filters

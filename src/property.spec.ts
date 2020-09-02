/* eslint-disable @typescript-eslint/no-var-requires */
import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'

import Property from './property'

chai.use(sinonChai)

const db = require('../models/index.js')

describe('Property', () => {
  before(function () {
    this.SequelizeModel = db.sequelize.models.User
    this.rawAttributes = this.SequelizeModel.attributes || this.SequelizeModel.rawAttributes
  })

  describe('#isArray', () => {
    it('returns false for regular (not arrayed) property', function () {
      const property = new Property(this.rawAttributes.email)
      expect(property.isArray()).to.equal(false)
    })

    it('returns true for array property', function () {
      const property = new Property(this.rawAttributes.arrayed)
      expect(property.isArray()).to.equal(true)
    })
  })

  describe('#type', () => {
    it('returns correct string type', function () {
      const property = new Property(this.rawAttributes.firstName)
      expect(property.type()).to.equal('string')
    })

    it('returns correct integer type', function () {
      const property = new Property(this.rawAttributes.id)
      expect(property.type()).to.equal('number')
    })

    it('returns correct date type', function () {
      const property = new Property(this.rawAttributes.createdAt)
      expect(property.type()).to.equal('datetime')
    })

    it('returns string when property is an array of strings', function () {
      const property = new Property(this.rawAttributes.arrayed)
      expect(property.type()).to.equal('string')
    })
  })

  describe('#availableValues', () => {
    it('returns null for all standard (Non enum) values', function () {
      const property = new Property(this.rawAttributes.email)
      expect(property.availableValues()).to.equal(null)
    })

    it('returns array of values for the enum field', function () {
      const property = new Property(this.rawAttributes.gender)
      expect(property.availableValues()).to.deep.equal(['male', 'female'])
    })
  })

  describe('isRequired', () => {
    it('returns true for required fields', function () {
      const property = new Property(this.rawAttributes.email)
      expect(property.isRequired()).to.equal(true)
    })

    it('returns false for not required fields', function () {
      const property = new Property(this.rawAttributes.gender)
      expect(property.isRequired()).to.eq(false)
    })
  })
})

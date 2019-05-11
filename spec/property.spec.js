const Property = require('../src/property')

const db = require('../models/index.js')

describe('Property', function () {
  before(function () {
    this.SequelizeModel = db.sequelize.models.User
    this.rawAttributes = this.SequelizeModel.attributes || this.SequelizeModel.rawAttributes
  })

  after(function () {
    db.sequelize.close()
  })

  describe('#type', function () {
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
  })

  describe('#availableValues', function () {
    it('returns null for all standard (Non enum) values', function () {
      const property = new Property(this.rawAttributes.email)
      expect(property.availableValues()).to.equal(null)
    })

    it('returns array of values for the enum field', function () {
      const property = new Property(this.rawAttributes.gender)
      expect(property.availableValues()).to.deep.equal(['male', 'female'])
    })
  })
})

const Property = require('../src/property')

describe('Property', function () {
  before(function () {
    this.db = require('../models/index.js')
    this.SequelizeModel = this.db.sequelize.models.User
  })

  after(function () {
    this.db.sequelize.close()
  })

  describe('#type', function () {
    it('returns correct string type', function () {
      const property = new Property(this.SequelizeModel.attributes.firstName)
      expect(property.type()).to.equal('string')
    })

    it('returns correct integer type', function () {
      const property = new Property(this.SequelizeModel.attributes.id)
      expect(property.type()).to.equal('number')
    })

    it('returns correct date type', function () {
      const property = new Property(this.SequelizeModel.attributes.createdAt)
      expect(property.type()).to.equal('datetime')
    })
  })
})

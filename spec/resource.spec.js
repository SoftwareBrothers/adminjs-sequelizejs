const { ValidationError } = require('admin-bro')
const Sequelize = require('sequelize')
const Resource = require('../src/resource')
const Filters = require('../src/utils/filters')
const Property = require('../src/property')
const config = require('../config/config')[process.env.NODE_ENV]
const db = require('../models/index.js')

const { Op } = Sequelize

describe('Resource', function () {
  before(function () {
    this.SequelizeModel = db.sequelize.models.User
    this.resource = new Resource(this.SequelizeModel)
  })

  after(function () {
    db.sequelize.close()
  })

  afterEach(function () {
    this.SequelizeModel.destroy({ where: {} })
  })

  describe('.isAdapterFor', function () {
    it('returns true when sequelize model is given', function () {
      expect(Resource.isAdapterFor(this.SequelizeModel)).to.equal(true)
    })
  })

  describe('#database', function () {
    it('returns correct database name', function () {
      expect(this.resource.databaseName()).to.equal(config.database)
    })
  })

  describe('#databaseType', function () {
    it('returns correct database', function () {
      expect(this.resource.databaseType()).to.equal(config.dialect)
    })
  })

  describe('#name', function () {
    it('returns correct name', function () {
      expect(this.resource.name()).to.equal('Users')
    })
  })

  describe('#id', function () {
    it('returns correct name', function () {
      expect(this.resource.id()).to.equal('users')
    })
  })

  describe('#properties', function () {
    it('returns all properties', function () {
      const { length } = Object.keys(this.SequelizeModel.attributes)
      expect(this.resource.properties()).to.have.lengthOf(length)
    })
  })

  describe('#property', function () {
    it('returns given property', function () {
      expect(this.resource.property('email')).to.be.an.instanceOf(Property)
    })
  })

  describe('#count', function () {
    it('returns 0 when there are none elements', async function () {
      const count = await this.resource.count({})
      expect(count).to.equal(0)
    })

    it('returns given count without filters', async function () {
      await this.resource.create(this.params)
      expect(await this.resource.count({})).to.equal(1)
    })

    it('returns given count for given filters', async function () {
      await this.resource.create({
        firstName: 'john',
        lastName: 'doe',
        email: 'john.doe@softwarebrothers.co',
        createdAt: '2019-01-05',
      })
      await this.resource.create({
        firstName: 'andrew',
        lastName: 'golota',
        email: 'andrew.golota@softwarebrothers.co',
        createdAt: '2019-01-09',
      })
      const filters = { createdAt: { to: '2019-01-25', from: '2019-01-09' } }
      expect(await this.resource.count(filters)).to.equal(1)
    })
  })

  describe('#convertedFilters', function () {
    it('returns empty object if no filters', async function () {
      expect(await Filters.convertedFilters({})).to.deep.equal({})
    })

    it('returns converted filters, if provided', async function () {
      expect(await Filters.convertedFilters({ email: 'example' })).to.deep.equal({ email: { [Op.iRegexp]: 'example' } })
    })

    it('escapes special chars to be used in regex', async function () {
      expect(await Filters.convertedFilters({ content: '+$' })).to.deep.equal({ content: { [Op.iRegexp]: '\\+\\$' } })
    })
  })

  describe('#create', function () {
    context('correct record', function () {
      beforeEach(async function () {
        this.params = {
          firstName: 'john',
          lastName: 'doe',
          email: 'john.doe@softwarebrothers.co',
        }
        this.record = await this.resource.create(this.params)
      })

      it('creates new user when data is valid', async function () {
        const newCount = await this.resource.count()
        expect(newCount).to.equal(1)
      })

      it('returns an object', function () {
        expect(this.record).to.be.an.instanceof(Object)
      })
    })

    context('record with errors', function () {
      beforeEach(async function () {
        this.params = {
          firstName: '',
          lastName: 'doe',
          email: 'john.doe.co',
        }
      })

      it('throws validation error', async function () {
        try {
          await this.resource.create(this.params)
        } catch (error) {
          expect(error).to.be.an.instanceOf(ValidationError)
        }
      })
    })
  })

  describe('#update', function () {
    beforeEach(async function () {
      this.params = {
        firstName: 'john',
        lastName: 'doe',
        email: 'john.doe@softwarebrothers.co',
      }
      this.record = await this.resource.create(this.params)
    })

    it('updates the title', async function () {
      this.newEmail = 'w@k.pl'
      this.record = await this.resource.update(this.record.id, {
        email: this.newEmail,
      })
      expect(this.record.email).to.equal(this.newEmail)
    })
  })
})

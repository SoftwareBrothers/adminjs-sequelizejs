const { ValidationError, Filter, BaseRecord } = require('admin-bro')
const Resource = require('../src/resource')
const Property = require('../src/property')
const config = require('../config/config')[process.env.NODE_ENV]
const db = require('../models/index.js')

describe('Resource', function () {
  before(function () {
    this.SequelizeModel = db.sequelize.models.User
    this.resource = new Resource(this.SequelizeModel)
  })

  after(async function () {
    await db.sequelize.close()
  })

  afterEach(async function () {
    await this.SequelizeModel.destroy({ where: {} })
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
      expect(this.resource.id()).to.equal('Users')
    })
  })

  describe('#properties', function () {
    it('returns all properties', function () {
      const length = 8 // there are 8 properties in the User model (5 regular + __v and _id)
      expect(this.resource.properties()).to.have.lengthOf(length)
    })
  })

  describe('#property', function () {
    it('returns given property', function () {
      expect(this.resource.property('email')).to.be.an.instanceOf(Property)
    })

    it('returns null when property doesn\'t exit', function () {
      expect(this.resource.property('some.imagine.property')).to.be.null
    })

    it('returns nested property for array field', function () {
      const property = this.resource.property('arrayed.1')

      expect(property).to.be.an.instanceOf(Property)
      expect(property.type()).to.equal('string')
    })
  })

  describe('#findMany', function () {
    it('returns array of BaseRecords', async function () {
      const params = await this.resource.create({ email: 'john.doe@softwarebrothers.co' })

      const records = await this.resource.findMany([params.id])

      expect(records).to.have.lengthOf(1)
      expect(records[0]).to.be.instanceOf(BaseRecord)
    })
  })

  describe('#find with filter', function () {
    beforeEach(async function () {
      this.params = {
        gender: 'male',
        email: 'john.doe@softwarebrothers.co',
      }
      this.record = await this.resource.create(this.params)
    })

    it('returns 1 BaseRecord when filtering on ENUMS', async function () {
      const filter = new Filter({
        gender: 'male',
      }, this.resource)
      const records = await this.resource.find(filter, { limit: 20, offset: 0, sort: { direction: 'asc', sortBy: 'id' } })

      expect(records).to.have.lengthOf(1)
      expect(records[0]).to.be.instanceOf(BaseRecord)
      expect(records[0].params.gender).to.equal('male')
    })

    it('returns 0 BaseRecord when filtering on ENUMS', async function () {
      const filter = new Filter({
        gender: 'female',
      }, this.resource)
      const records = await this.resource.find(filter, { limit: 20, offset: 0, sort: { direction: 'asc', sortBy: 'id' } })

      expect(records).to.have.lengthOf(0)
    })

    it('returns error when filtering on ENUMS with invalid value', async function () {
      const filter = new Filter({
        gender: 'XXX',
      }, this.resource)
      try {
        await this.resource.find(filter, { limit: 20, offset: 0, sort: { direction: 'asc', sortBy: 'id' } })
      } catch (error) {
        expect(error).to.be.an.instanceOf(db.sequelize.DatabaseError)
      }
    })
  })

  describe('#count', function () {
    it('returns 0 when there are none elements', async function () {
      const count = await this.resource.count(new Filter({}))
      expect(count).to.equal(0)
    })

    it('returns given count without filters', async function () {
      await this.resource.create({ email: 'john.doe@softwarebrothers.co' })
      expect(await this.resource.count(new Filter({}))).to.equal(1)
    })

    it('returns given count for given filters', async function () {
      await this.resource.create({
        firstName: 'john',
        lastName: 'doe',
        email: 'john.doe@softwarebrothers.co',
      })
      await this.resource.create({
        firstName: 'andrew',
        lastName: 'golota',
        email: 'andrew.golota@softwarebrothers.co',
      })
      const filter = new Filter({
        email: 'andrew.golota@softwarebrothers.co',
      }, this.resource)
      expect(await this.resource.count(filter)).to.equal(1)
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

    context('record with empty id field', function () {
      beforeEach(function () {
        this.SequelizeModel = db.sequelize.models.Post
        this.resource = new Resource(this.SequelizeModel)
      })

      it('creates record without an error', async function () {
        this.params = {
          title: 'some title',
          description: 'doe',
          publishedAt: '2019-12-10 12:00',
          userId: '',
        }
        this.recordParams = await this.resource.create(this.params)
        expect(this.recordParams.userId).to.be.null
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

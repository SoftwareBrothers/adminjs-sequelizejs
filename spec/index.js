process.env.NODE_ENV = 'test'

const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon')
const { factory } = require('factory-girl')

chai.use(sinonChai)

global.expect = chai.expect
global.factory = factory

beforeEach(function () {
  this.sinon = sinon.createSandbox()
})

afterEach(function () {
  this.sinon.restore()
})

require('./database.spec.js')
require('./resource.spec.js')
require('./property.spec.js')

const { expect } = require('chai')
const { Exception } = require('../dist')
class TestExeption extends Exception {}

describe('Exception', () => {
  it('Should throw alot of errors', () => {
    try {
      throw TestExeption.for('Something good is bad')
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something good is bad')
      expect(e.code).to.equal(500)
    }

    try {
      throw TestExeption.for('Something good is bad').withCode(599)
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something good is bad')
      expect(e.code).to.equal(599)
    }
  
    try {
      throw TestExeption.for('Something good is bad', 'good', 'bad')
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something good is bad')
      expect(e.code).to.equal(500)
    }
  
    try {
      throw TestExeption.for('Something %s is %s', 'good', 'bad')
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something good is bad')
      expect(e.code).to.equal(500)
    }
  
    try {
      throw TestExeption.for('Something %s is %s', 1, [1])
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something 1 is 1')
      expect(e.code).to.equal(500)
    }
  
    try {
      throw TestExeption.forErrorsFound({key: 'value'})
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Invalid Parameters')
      expect(e.errors.key).to.equal('value')
      expect(e.code).to.equal(500)
    }
  
    try {
      TestExeption.require(false, 'Something %s is %s', 'good', 'bad')
    } catch(e) {
      expect(e.name).to.equal('TestExeption')
      expect(e.message).to.equal('Something good is bad')
      expect(e.code).to.equal(500)
    }
  })
})

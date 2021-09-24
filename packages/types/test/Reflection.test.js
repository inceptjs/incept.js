const { expect } = require('chai')
const { Reflection } = require('../dist')

const V = { zoo: 'bar', foo() {}, get wop() { return 'bam' } }
const W = { foo: 'zoo', bar() {} }

class X {
  get bam() {
    return 'wop'
  }
  
  foo(bar) {
    return bar + bar
  }  
}

class Y {
  static foo = 'zoo'
  static bar() {}  
}

class Z extends X {
  zoo() {}  
}

describe('Reflection', () => {
  it('Should analyze objects and functions', () => {
    const prototypeOfV = Reflection.getPrototypeOf(V)
    const prototypeOfW = Reflection.getPrototypeOf(W)
    const prototypeOfX = Reflection.getPrototypeOf(X)
    const prototypeOfY = Reflection.getPrototypeOf(Y, true)
    const prototypeOfZ = Reflection.getPrototypeOf(Z)
    expect(prototypeOfV).to.include('zoo')
    expect(prototypeOfV).to.include('foo')
    expect(prototypeOfV).to.include('wop')
    expect(prototypeOfW).to.include('foo')
    expect(prototypeOfW).to.include('bar')
    expect(prototypeOfX).to.include('bam')
    expect(prototypeOfX).to.include('foo')
    expect(prototypeOfY).to.include('foo')
    expect(prototypeOfY).to.include('bar')
    expect(prototypeOfZ).to.include('zoo')
    expect(prototypeOfZ).to.include('bam')
    expect(prototypeOfZ).to.include('foo')

    const propertiesOfV = Reflection.getPropertyNamesOf(V)
    const propertiesOfW = Reflection.getPropertyNamesOf(W)
    expect(propertiesOfV).to.include('zoo')
    expect(propertiesOfW).to.include('foo')

    const methodsOfV = Reflection.getMethodNamesOf(V)
    const methodsOfW = Reflection.getMethodNamesOf(W)
    const methodsOfX = Reflection.getMethodNamesOf(X)
    const methodsOfY = Reflection.getMethodNamesOf(Y, true)
    const methodsOfZ = Reflection.getMethodNamesOf(Z)
    expect(methodsOfV).to.include('foo')
    expect(methodsOfW).to.include('bar')
    expect(methodsOfX).to.include('foo')
    expect(methodsOfY).to.include('bar')
    expect(methodsOfZ).to.include('zoo')
    expect(methodsOfZ).to.include('foo')

    expect(Reflection.isClass(V)).to.equal(false)
    expect(Reflection.isClass(Z)).to.equal(true)

    const z = new Z
    expect(Reflection.getArgumentNamesOf(z.foo)).to.include('bar')
    expect(Reflection.implements(z, Z, X)).to.equal(true)
    
    const noop1 = () => {}
    const noop2 = () => {}
    const noop3 = (bar) => {}
    class Noop { foo(bar) {} }
    
    //object implements object
    expect(Reflection.implements({ noop1 }, { noop2 })).to.equal(false)
    expect(Reflection.implements({ noop: noop1 }, { noop: noop2 })).to.equal(true)
    //its false because wrong argument
    expect(Reflection.implements({ noop: noop1 }, { noop: noop3 })).to.equal(false)

    //object implements Class without instantiating
    expect(Reflection.implements({ foo: noop3 }, Noop)).to.equal(true)
  })

  it('Should assign, extend and clone', () => {
    const z = new Z
    Reflection.assign(z, Y)
    expect(Reflection.implements(z, Z, X, Y)).to.equal(true)

    Reflection.extends(Z, Y)
    expect(Reflection.implements(Z, X, Y)).to.equal(true)

    const x = Reflection.clone(z)
    x.x = 4
    z.z = 5
    expect(z.x).to.not.equal(4)
    expect(x.z).to.not.equal(5)

    const original = new X
    const clone = Reflection.reflect(original).assign({bar: 'foo'}).clone()
    clone.bar = 'bar'
    expect(original.bar).to.not.equal(clone.bar)
  })

  it('Should map and filter', () => {
    const actual = Reflection
      .reflect({ foo: 'bar', bar: 'foo', zoo: 'bar'})
      .filter(value => value === 'bar')
      .map({bam: 'wop'}, value => value + 'ow')
      .map(value => value + '1')
      .get()

    expect(actual.foo).to.equal('bar1')
    expect(actual.zoo).to.equal('bar1')
    expect(actual.bam).to.equal('wopow1')
  })

  it('Should name/rename function', () => {
    const f1 = function() {}
    const f2 = function foo() {}
    const f3 = () => {}
    const f4 = async () => {}
    const f5 = async function() {}
    const f6 = async function zoo() {}
    
    Reflection.rename(f1, 'a')
    Reflection.rename(f2, 'b')
    Reflection.rename(f3, 'c')
    Reflection.rename(f4, 'd')
    Reflection.rename(f5, 'e')
    Reflection.rename(f6, 'f')

    expect(f1.name).to.equal('a')
    expect(f2.name).to.equal('b')
    expect(f3.name).to.equal('c')
    expect(f4.name).to.equal('d')
    expect(f5.name).to.equal('e')
    expect(f6.name).to.equal('f')
  })
})

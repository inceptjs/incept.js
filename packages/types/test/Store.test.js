const { expect } = require('chai')
const { Store } = require('../dist')

describe('Store', () => {
  it('Should set/has/remove/get', () => {
    const store = new Store
    store.set('foo', 'bar', 'zoo')
    store.set('foo', 'zoo', ['foo', 'bar', 'zoo'])
  
    expect(store.has('foo', 'bar')).to.equal(true)
    expect(store.has('bar', 'foo')).to.equal(false)
    expect(store.get('foo', 'zoo', 1)).to.equal('bar')
  
    store.remove('foo', 'bar')
    expect(store.has('foo', 'bar')).to.equal(false)
    expect(store.has('foo', 'zoo')).to.equal(true)
  })

  it('Should walk', () => {
    //foo=bar&zoo[]=1&zoo[]=2&zoo[]=3&product[title]=test
    //&product[price]=1000&product[rating][]=1&product[rating][]=2
    //&product[rating][]=3&product[abstract][][name]=john
    //&product[abstract][][name]=james&boom[]=1
    const store = new Store
    store.set('foo', 'bar')
    store.set('zoo', '', 1)
    store.set('zoo', '', 2)
    store.set('zoo', '', 3)
    store.set('product', 'title', 'test')
    store.set('product', 'price', 1000)
    store.set('product', 'rating', '', 1)
    store.set('product', 'rating', '', 2)
    store.set('product', 'rating', '', 3)
    store.set('product', 'abstract', '', 'name', 'john')
    store.set('product', 'abstract', '', 'name', 'james')
    store.set('boom', '', 1)
  
    const expected = '{"foo":"bar","zoo":[1,2,3],"product":{"title":"test",'
      + '"price":1000,"rating":[1,2,3],"abstract":[{"name":"john"},'
      + '{"name":"james"}]},"boom":[1]}'
  
    expect(JSON.stringify(store.get())).to.equal(expected)
  })

  it('Should set by query', () => {
    const store1 = new Store
    store1.withQuery.set('foo=bar&zoo[]=1&zoo[]=2&zoo[]=3&product[title]=test'
      + '&product[price]=1000&product[rating][]=1&product[rating][]=2'
      + '&product[rating][]=3&product[abstract][][name]=john'
      + '&product[abstract][][name]=james&boom[]=1'
    )

    const expected1 = '{"foo":"bar","zoo":[1,2,3],"product":{"title":"test",'
      + '"price":1000,"rating":[1,2,3],"abstract":[{"name":"john"},'
      + '{"name":"james"}]},"boom":[1]}'

    expect(JSON.stringify(store1.get())).to.equal(expected1)

    const store2 = new Store
    store2.withQuery.set('foo', 'bar', 'foo=bar&zoo[]=1&zoo[]=2'
      + '&zoo[]=3&product[title]=test&product[price]=1000'
      + '&product[rating][]=1&product[rating][]=2'
      + '&product[rating][]=3&product[abstract][][name]=john'
      + '&product[abstract][][name]=james&boom[]=1'
    )

    const expected2 = '{"foo":{"bar":{"foo":"bar","zoo":[1,2,3],'
    + '"product":{"title":"test","price":1000,"rating":[1,2,3],'
    + '"abstract":[{"name":"john"},{"name":"james"}]},"boom":[1]}}}'

    expect(JSON.stringify(store2.get())).to.equal(expected2)
  })

  it('Should set by paths', () => {
    const store = new Store
    store.withPath.set('foo', 'bar')
    store.withPath.set('zoo.', 1)
    store.withPath.set('zoo.', 2)
    store.withPath.set('zoo.', 3)
    store.withPath.set('product.title', 'test')
    store.withPath.set('product.price', 1000)
    store.withPath.set('product.rating.', 1)
    store.withPath.set('product.rating.', 2)
    store.withPath.set('product.rating.', 3)
    store.withPath.set('product.abstract..name', 'john')
    store.withPath.set('product.abstract..name', 'james')
    store.withPath.set('boom.', 1)

    const expected = '{"foo":"bar","zoo":[1,2,3],"product":{"title":"test",'
      + '"price":1000,"rating":[1,2,3],"abstract":[{"name":"john"},'
      + '{"name":"james"}]},"boom":[1]}'

    expect(JSON.stringify(store.get())).to.equal(expected)
  })

  it('Should set by args', () => {
    const store1 = new Store
    store1.withArgs.set('--a 1 --b=2 -c 3 -d=4 -efg 4 -hi --jkl')
    const expected1 = '{"a":1,"b":2,"c":3,"d":4,"e":true,"f":true,"g":4,"h":true,"i":true,"jkl":true}'
    expect(JSON.stringify(store1.get())).to.equal(expected1)

    const store2 = new Store
    store2.withArgs.set('--a.b=1 --a 2 -ab -bc -d one -d=two --d=3')
    const expected2 = '{"a":[{"b":1},2,true],"b":[true,true],"c":true,"d":["one","two",3]}'
    expect(JSON.stringify(store2.get())).to.equal(expected2)

    const store3 = new Store
    store3.withArgs.set('foo', 'bar', '--a.b=1 --a 2 -ab -bc -d one -d=two --d=3')
    const expected3 = '{"foo":{"bar":{"a":[{"b":1},2,true],"b":[true,true],"c":true,"d":["one","two",3]}}}'
    expect(JSON.stringify(store3.get())).to.equal(expected3)

    const store4 = new Store
    store4.withArgs.set('foo', 'bar', '--host=127.0.0.1 --port 8080')
    const expected4 = '{"foo":{"bar":{"host":"127.0.0.1","port":8080}}}'
    expect(JSON.stringify(store4.get())).to.equal(expected4)


  })

  it('Should set by form data', () => {
    const store1 = new Store
    store1.withFormData.set(multipart)

    expect(store1.get('text')).to.equal('text default')

    const file1 = store1.get('uploads', 0)
    expect(file1.name).to.equal('somebinary.dat')
    expect(file1.type).to.equal('application/octet-stream')
    expect(file1.data.toString()).to.equal('some binary data...maybe the bits of a image..')
    
    const file2 = store1.get('uploads', 1)
    expect(file2.name).to.equal('sometext.txt')
    expect(file2.type).to.equal('text/plain')
    expect(file2.data.toString()).to.equal('hello world')

    const store2 = new Store
    store2.withFormData.set('foo', 'bar', multipart)

    expect(store2.get('foo', 'bar', 'text')).to.equal('text default')

    const file3 = store2.get('foo', 'bar', 'uploads', 0)
    expect(file3.name).to.equal('somebinary.dat')
    expect(file3.type).to.equal('application/octet-stream')
    expect(file3.data.toString()).to.equal('some binary data...maybe the bits of a image..')
    
    const file4 = store2.get('foo', 'bar', 'uploads', 1)
    expect(file4.name).to.equal('sometext.txt')
    expect(file4.type).to.equal('text/plain')
    expect(file4.data.toString()).to.equal('hello world')
  })
})

const multipart =
`------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="uploads[]"; filename="somebinary.dat"
Content-Type: application/octet-stream

some binary data...maybe the bits of a image..
------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="text"

text default
------WebKitFormBoundaryDtbT5UpPj83kllfw
Content-Disposition: form-data; name="uploads[]"; filename="sometext.txt"
Content-Type: text/plain

hello world
------WebKitFormBoundaryDtbT5UpPj83kllfw--` 

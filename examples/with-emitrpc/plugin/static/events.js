import { EventEmitter } from 'inceptjs'

const emitter = new EventEmitter

emitter.on('company-detail', (req, res) => {
  if (req.params?.id !== 1) {
    return res.write({ error: true, message: 'Not Found.'})
  }

  res.write({
    error: false,
    results: {
      name: 'incept'
    }
  })
})

export default emitter
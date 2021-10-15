import path from 'path'

export default function(app) {
  app.withReact.layout('shakra', path.join(__dirname, 'Layout'))
}
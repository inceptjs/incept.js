import path from 'path'

export default function(app) {
  app.withReact.layout('mui5', path.join(__dirname, 'Layout'))
}
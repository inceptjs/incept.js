import Document from './Document'

export default function(app) {
  app.withReact.document = Document
}
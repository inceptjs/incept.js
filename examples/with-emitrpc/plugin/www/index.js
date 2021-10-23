import { middleware } from 'emitrpc'

export default function(app) {
  app.use(middleware(app))
  app.withReact.layout(
    'default', 
    `${__dirname}/Layout/StaticLayout`,
    `${__dirname}/Layout/ServerLayout`
  )
}
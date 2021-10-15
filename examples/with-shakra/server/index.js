import path from 'path'
import ReactDOMServer from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import { CacheProvider } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'

import theme from '../client/theme'
import createEmotionCache from '../client/createEmotionCache'

function chakraHandler(req, res) {
  //let anything override this behaviour
  if (typeof res.body === 'string' 
    || typeof res.body?.pipe === 'function'
  ) {
    return;
  }
  //get route
  const route = this.withReact.match(req.pathname)
  //if no matching react routes 
  //or the layout isn't mui (remove this if you want to mui everything)
  if (!route || route.layout !== 'mui') {
    return
  }

  const cache = createEmotionCache()

  //get router props
  const routerProps = { location: pathname, context: {} }
  //now do the loadable chunking thing..
  //see: https://loadable-components.com/docs/server-side-rendering/
  const server = new ChunkExtractor({ 
    statsFile: path.join(this.buildPath, 'server/stats.json')
  })
  const { default: App } = server.requireEntrypoint();
  const client = new ChunkExtractor({ 
    statsFile: path.join(this.buildPath, 'static/stats.json'),
    publicPath: this.buildURL
  })

  //wrap everything needed around the app
  const Wrapper = <CacheProvider value={cache}>
    <ChakraProvider theme={theme}>
      <StaticRouter {...routerProps}><App /></StaticRouter>
    </ChakraProvider>
  </CacheProvider>
  //render the app now
  const app = ReactDOMServer.renderToString(
    client.collectChunks(Wrapper)
  );

  //clone the page
  const page = this._page.clone
  //add links to head
  client.getLinkElements().forEach(link => {
    page.head.addChild(link)
  })
  //add styles to head
  client.getStyleElements().forEach(style => {
    page.head.addChild(style)
  })
  //add scripts to body
  client.getScriptElements().forEach(script => {
    page.body.addChild(script)
  })
  //render the page
  return page.render(app)
}

export default async function(app) {
  const routes = app.withReact.routes
  for (const route of routes) {
    app.get(route.path, chakraHandler.bind(app), 1)
  }

  app.withReact.layout('chakra', path.join(app.cwd, 'client/Layout'))

  //make a public
  app.public(path.join(app.cwd, 'public'), '/')
  //react routes
  app.withReact.route('/', path.join(app.cwd, 'pages/Home'))
  app.withReact.route('/about', path.join(app.cwd, 'pages/About'), 'chakra')
}
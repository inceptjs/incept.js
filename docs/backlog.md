# Backlog

 - Develop `$ incept build` Script
 - Develop `$ incept start` Script
 - Develop `$ incept lint` Script
 - Move scripts to a package called `devops`
 - Move babel configuration into a package called `presets`
 - Move webpack configuration into a package called `presets`
 - Move admin/icons into a package called `icons`
 - Build EventRPC
 - Build Admin Builder *(in ts)*
   - Dashboard
   - Admin
     - Profiles
     - Auth
     - Roles
   - API
     - Applications
     - Sessions
     - Scopes
     - REST
     - Webhooks
   - System
     - Schemas
     - Fieldsets
   - Configuration
     - Settings
     - Languages
     - Packages 
  - Build ORM package called `storm`
    - Build drivers for SQL
    - Build drivers for MongoDB
  - Build serverless package called `serverless`

# Notes

Adventures in developing a modern React framework. The following items,
I'm looking for help or clarity.

**Babel**

To me, Babel's original intent is to start using ES6/7 now, React's JSX
kind of opened the flood gates of just using it to transpile anything 
anyone invents as syntax. Non standard imports like css and svg, though 
is a huge convenience still feels out of place, like babel wasnt meant 
for that.

**Webpack**

There is a huge overlap between Babel and Webpack in terms of intent. 
If babel is for transpiling and webpack is for bundling, what's up 
with isomorphic plugins?

**Isomorphic Babel & Webpack**

Both of these projects suffer from plugins that need to be isomorphic 
being outdated in a matter of years like CSS, SVG, file & url importing.
I ended up fixing and hosting up a fork of 
[`babel-plugin-file-loader`](https://github.com/cblanquera/babel-plugin-file-loader)

**webpack-dev-middleware**

For some reason `webpack-dev-middleware` is compiling for the 
regular build and another for cache. It makes it look like it's 
compiling the same thing twice and could be mistaken for a bug.
all this does is make sure when the compile is complete it is 
logged once. I added a hook to suppress this from showing on the 
console twice and silenced logging.

**This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills**
**This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills**

I'm not sure why this warning is triggered as soon as I import 
`react-redux`. The source of this console error comes from 
[scheduler](https://github.com/facebook/react/tree/main/packages/scheduler),
but i can't find it in their source. When you install `react-dom` you can 
find it in `node_modules/scheduler/cjs/scheduler.development.js:102` and
triggers when loading a SSR entry inherently using `react-redux`.

**@loadable/server**

This is the only reason why I'm building files in dev mode instead of 
loading it in memory. see the 
[loadable docs](https://loadable-components.com/docs/api-loadable-server/) 
on this.

```js
import { ChunkExtractor } from '@loadable/server'
const statsFile = path.resolve('../dist/loadable-stats.json')
const chunkExtractor = new ChunkExtractor({ statsFile })
```

Implementing loadable in general with chunking based on their docs, 
though works, is quite clunky and loadable puts some branding in the 
HTML.

**Material UI**

Encountering errors with `useLayoutEffect` when rendering on the server
*(SSR)* even on MUI v5 which just released while developing this 
project. Plus I'm not a big fan of `styled-components` syntax nor the
v4 version of styling. They shouldn't be dog feed any of those to people 
exclusively. Just allow to add `className` or `style` to their 
components. I was very disappointed when I couldn't even use their 
icons without triggering a warning.
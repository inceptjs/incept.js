# Getting Started

Thanks for considering Incept for your next project. Please understand 
that this is an open source project still in development and currently 
is looking for more contributors. For now, we do not recommend using 
Incept on a production level till it is fully released. This 
documentation is provided to review the product and its concepts.

If you have any questions, please join the community on 
[Github Discussions](https://github.com/inceptjs/incept.js/discussions).

## Setup

We are currently developing `create-incept-app`. Stay tuned!

## Manual Setup

Just issue the `npm` or `yarn` command to install `inceptjs`

```bash
npm install inceptjs
# or
yarn add inceptjs
```

Open `package.json` and add the following values.

```js
{
  ...
  "scripts": {
    "dev": "incept dev",
    "build": "incept build",
    "start": "incept start"
  },
  "incept": [ "./index" ],
  ...
}
```

### Scripts

The scripts provided refer to each stage of your project that is 
supported by Incept.

 - `incept dev` - Starts a development server
 - `incept build` - Writes the necessary files needed to run a production server
 - `incept start` - Starts a production server

When you run `incept dev`, you will notice that no build files are 
generated. That is because those files are *kind of* stored in memory
to offset the need to manage those files. You can add the flag 
`incept dev --write` to inspect all the build files manually.

### Plugins

The key `incept` from the above example `"incept": [ "./index" ]` is 
used to declare the plugins that will be used for the project. Incept is 
built around this allowing plugins to originate from the project as well 
as `node_modules`.

In the project folder create a file called `index.js` and add the 
following code.

```js
import path from 'path'

export default async function(app) {
  //make a public
  app.public(path.resolve(__dirname, 'public'), '/')
  //react routes
  app.withReact.route('/', `${__dirname}/pages/Home`)
  app.withReact.route('/about', `${__dirname}/pages/About`)
}
```

Incept will automatically call the exported function and pass its 
context so you can freely define how your plugin interacts with the 
system. The code above does the fallowing.

 - Uses `app.public()` to allow people to access the public folder freely
 - Adds two react specific routes with `app.withReact.route()`

One thing you'll notice unique with `inceptjs`, is the `pages` folder is 
not actually required and you could technically place your files 
anywhere. 

Last thing to do is to make two folders called `public` and `pages` in 
the project folder. Inside of the `pages` folder make two files with the
following code.

```js
// File: ./pages/Home.js
import { Link } from 'inceptjs/components'
export default function Home() {
  return (
    <div>
      <h1>Welcome to Incept.js</h1>
      <Link to="/about">About</Link>
    </div>
  )
}
```

```js
// File: ./pages/About.js
import { Link } from 'inceptjs/components'
export default function About() {
  return (
    <div>
      <h1>About</h1>
      <Link to="/">Home</Link>
    </div>
  )
}
```

To start developing your application run `npm run dev` or `yarn dev` and 
visit http://localhost:3000 to view your application.

There's a lot of things that `incept dev` will take care of automatically
out of the box including the following. 

 - Babel transpilations
 - Webpack bundling and code splitting
 - CSS module transformation
 - HOT reloading and fast refresh

You can also tweak or fully re-configure `babel`, `webpack`, `react`. 
Without any other nuances of Incept, projects are technically 
production ready.

## Read More

 - [How Plugins Work](./plugins.md)
 - [React Page, App and Layouts](./layouts.md)
 - [Configuration and Options](./config.md)
 - [Installing UI Libraries](./uilib.md)
 - [Writing My Own Bash Commands](./terminal.md)
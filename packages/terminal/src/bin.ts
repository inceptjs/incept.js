import fs from 'fs';
import { Framework } from 'inceptjs';

import Loader from './types/Loader';
import Terminal from './types/Terminal';
import install from './loaders/install';
import generate from './loaders/generate';

const modules = Loader.modules();
const server = `${modules}/.incept/server`;

if (!fs.existsSync(server)) {
  Terminal.info('Installing...');
  install();
  Terminal.success('Done!');
} else {
  //get the latest config from the project folder
  const config = Loader.config();
  //load more bootstrap by simply adding to the plugins
  config.plugins = [ ...config.plugins ];
  [
    `${server}/loaders/schema`,
    `${server}/loaders/error`,
    `${server}/loaders/object`,
    `${server}/loaders/collection`
  ].forEach(loader => {
    if (fs.existsSync(`${loader}.js`)) {
      config.plugins.push(loader);
    }
  });

  //the app in server ignores the config because 
  //the plugins are hard coded in the app file
  //we should recreate the app manually instead
  const app = new Framework(config);
  //next load all the plugins
  Loader.plugins(Loader.cwd(), config.plugins).forEach(plugin => {
    app.load(require(plugin).default);
  });
  //load the code generator
  app.load(generate);
  //make a new terminal
  const terminal = new Terminal(app);
  //emit the event
  terminal.emit();
}


import type { Framework } from 'inceptjs';

import fs from 'fs';
import Loader from './types/Loader';
import Terminal from './types/Terminal';
import install from './loaders/install';
import generate from './loaders/generate';

const modules = Loader.modules();

if (!fs.existsSync(`${modules}/.incept/server`)) {
  console.log('Installing...');
  install();
  console.log('Done!');
} else {
  //syncronously require the app
  const { app } = require(`${modules}/.incept/server`);
  //bring back strict typing
  const ctx = app as Framework;
  ctx.load(generate);
  //make a new terminal
  const terminal = new Terminal(ctx);
  //emit the event
  terminal.emit();
}
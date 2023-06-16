import fs from 'fs';
import path from 'path';
import { Framework } from 'inceptjs';

export default function boot(ctx: Framework) {
  const build = path.resolve(__dirname, '..', '..', 'build', 'static');

  ctx.get('/', (req, res) => {
    //get the build file
    const file = path.resolve(build, 'index.html');
    //if it doesnt exist
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      return;
    }
    //set the mime type
    res.setHeader('Content-Type', 'text/html');
    //write the file
    res.send(fs.createReadStream(file));
    return false;
  });

  ctx.on('dispatch', (req, res) => {
    if (!res.sent && !res.body) {
      //get the build file
      const file = path.resolve(build, 'index.html');
      //if it doesnt exist
      if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
        return;
      }
      //set the mime type
      res.setHeader('Content-Type', 'text/html');
      //write the file
      res.send(fs.createReadStream(file));
      return false;
    }
  });
};
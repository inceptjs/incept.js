import fs from 'fs';
import path from 'path';
import { Framework } from 'inceptjs';

export default function boot(ctx: Framework) {
  const build = path.resolve(__dirname, '..', '..', '..', 'build', 'static');

  ctx.get('/', (req, res) => {
    //get the build file
    const file = path.resolve(build, 'index.html');
    //if it doesnt exist
    if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
      res.setStatus(404, 'Not Found');
      res.json({ error: true, message: 'Build file not found' });
      return;
    }
    //set the mime type
    res.setHeader('Content-Type', 'text/html');
    //write the file
    res.send(fs.createReadStream(file));
    return false;
  });

  ctx.on('response', async (req, res) => {
    if (!res.sent && !res.body) {
      //get the build file
      let file = path.resolve(build, req.url.pathname.substring(1));
      //if it doesnt exist
      if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
        //by default get the index
        file = path.resolve(build, 'index.html');
        //if it doesnt exist
        if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
          res.setStatus(404, 'Not Found');
          res.json({ error: true, message: 'Build file not found' });
          return;
        }
      }
      //set the mime type
      //write the file
      res.send(fs.createReadStream(file));
      return false;
    }
  }, 1);
};
import fs from 'fs';
import http from 'http';
import path from 'path';
import mime from 'mime';

import { Framework } from 'inceptjs';
import { dev, hot } from './develop';

export default function boot(ctx: Framework) {
  ctx.on('studio', (req, res) => {
    const port = req.params.port || req.params.p || 1337;
    const build = path.resolve(__dirname, '..', '..', 'build', 'static');
    const app = new Framework(ctx.config);
    //public asset folder
    app.on('request', (req, res) => {
      //if there is already a body
      if (res.body) {
        return;
      }
      //get the build file
      const file = path.join(build, req.url.pathname.substring(1));
      //if it doesnt exist
      if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
        return;
      }

      //get the mime type
      const mimeType = mime.getType(file);
      if (typeof mimeType === 'string') {
        //set the mime type
        res.setHeader('Content-Type', mimeType);
      }
      //write the file
      res.send(fs.createReadStream(file));
      //dont allow any other middleware to run after this
      return false;
    });

    if (process.env.NODE_ENV === 'development') {
      app.on('open', async (req, res) => {
        const pDev = new Promise(resolve => dev(
          req.resource, 
          res.resource, 
          resolve
        ));
        const pHot = new Promise(resolve => hot(
          req.resource, 
          res.resource, 
          resolve
        ));

        await pDev;
        await pHot;

        if (res.resource.headersSent) {
          return false;
        }
      });
    }

    app.get('/', (req, res) => {
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

    app.on('response', (req, res) => {
      if (!res.body) {
        res.setStatus(404, 'Not Found');
        res.json({ 
          error: true,
          code: 404,
          message: 'Not Found'
        });
      }
    });

    //create the http server
    const server = http.createServer(app.send.bind(app));
    //now start listening to the server
    server.listen(port);
    console.log('Server started on :1337');   
  })
}
import type { IncomingMessage, ServerResponse } from 'http';

import fs from 'fs';
import path from 'path';
import mime from 'mime';
import { Framework } from 'inceptjs';
import { dev, hot } from '../develop';

export default function boot(ctx: Framework) {
  const build = path.resolve(__dirname, '..', '..', 'build', 'static');

  if (process.env.NODE_ENV === 'development') {
    ctx.on('open', async (req, res) => {
      const im = req.resource as IncomingMessage;
      const sr = res.resource as ServerResponse;
      const pDev = new Promise(resolve => dev(im, sr, resolve));
      const pHot = new Promise(resolve => hot(im, sr, resolve));

      await pDev;
      await pHot;

      if (sr.headersSent) {
        return false;
      }
    });
  }

  //public asset folder
  ctx.on('request', (req, res) => {
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

  //public asset folder
  ctx.on('response', (req, res) => {
    //if there is already a body
    if (res.sent || res.body) {
      return;
    }
    res.setStatus(404, 'Not Found');
    res.json({ error: true, message: 'Not found' });
  });
};
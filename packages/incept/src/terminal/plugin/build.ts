import { Request } from '@inceptjs/framework';

import Application from '../../types/Application';

import { logError } from '../logs';

function buildWebpackBundles(request: Request): void {
  //get the app
  const app = request.ctx as Application;
  //log all errors
  app.on('error', logError.bind(app));
  //load webpack
  app.withWebpack.build();
}

export default function buildPlugin(ctx: Application) {
  ctx.on('build', buildWebpackBundles);
}
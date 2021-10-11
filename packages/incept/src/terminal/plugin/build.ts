import { Request } from '@inceptjs/framework';

import { logError } from './develop/logs';
import Application from '../../types/Application';

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
import type { Framework, RouterConfig } from 'inceptjs/server';

import path from 'path';
import { Schema, Loader } from 'inceptjs/dist/server';

function getSchemaFolder(config: RouterConfig) {
  const folder = config.schemas || './schema';
  if (folder.indexOf('./') === 0) {
    return path.join(config.cwd, folder.replace('./', '')); 
  } else if (folder.indexOf('../') === 0) {
    return path.join(path.dirname(config.cwd), folder.replace('../', '')); 
  }
  return folder;
}

export default async function boot(ctx: Framework) {
  //try to get all json files in the schema directory (defined in config.schema)
  try { 
    const config = await Loader.require(Loader.config());
    Schema.addFolder(getSchemaFolder(config.schemas));
  } catch (e) {
    console.error(e);
  }
};
import Framework from './types/Framework';
import Request from './types/Request';
import Response from './types/Response';
import Exception from './types/Exception';
import Schema from './types/Schema';

import collection from './events/collection';
import error from './events/error';
import object from './events/object';

import { getSchemaFolder } from './utils';

//try to get all json files in the schema directory (defined in config.schema)
try { 
  Schema.addFolder(getSchemaFolder(process.cwd()));
} catch (e) {
  console.error(e);
}
//globally load the app instance
const inceptGlobal = global as unknown as { incept: Framework };
const app = inceptGlobal.incept || new Framework();

if (process.env.NODE_ENV !== 'production') {
  inceptGlobal.incept = app;
}
//load all system events
app.use(collection, error, object);

export { Schema, Framework, Request, Response, Exception };
export default app;
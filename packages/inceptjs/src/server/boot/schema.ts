import Schema from '../types/Schema';
import { getSchemaFolder } from '../utils';

//try to get all json files in the schema directory (defined in config.schema)
try { 
  Schema.addFolder(getSchemaFolder(process.cwd()));
} catch (e) {
  console.error(e);
}
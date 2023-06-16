import type { SchemaConfig } from 'inceptjs';

import fs from 'fs';
import path from 'path';
import { Framework } from 'inceptjs';
import Loader from '../types/Loader';

export default function boot(ctx: Framework) {
  const schemaFolder = Loader.schemas(ctx.config);
  //search
  ctx.get('/api/schema', (req, res) => {
    const schemas: Record<string, SchemaConfig> = {};
    //read all files in the schema folder
    fs.readdirSync(schemaFolder).filter(
      file => file.endsWith('.json')
    //parse each file as json
    ).forEach(file => {
      if (fs.lstatSync(path.join(schemaFolder, file)).isDirectory()) {
        return;
      }

      const schema = Loader.require(path.join(schemaFolder, file));
      if (typeof schema !== 'object') {
        return;
      }
      schemas[schema.name] = schema;
    });
    res.json({ error: false, results: schemas });
  });

  //create
  ctx.post('/api/schema', (req, res) => {});

  //update
  ctx.put('/api/schema/:name', (req, res) => {});

  //remove
  ctx.delete('/api/schema/:name', (req, res) => {});
};
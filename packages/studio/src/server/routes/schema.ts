import type { IncomingMessage } from 'http';
import type { SchemaConfig } from 'inceptjs';

import fs from 'fs';
import path from 'path';
import { Framework } from 'inceptjs';
import Loader from '../types/Loader';
import validate from '../validate';

const parseJSONBody: <T = any>(im: IncomingMessage) => Promise<T> = im => {
  return new Promise(resolve => {
    let body = '';
    im.on('data', chunk => {
      body += chunk.toString();
    });
    im.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

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
  ctx.post('/api/schema', async (req, res) => {
    const schema = await parseJSONBody<SchemaConfig>(req.resource);
    const errors = validate(schema, true);
    if (Object.keys(errors).length) {
      res.json({ error: true, errors });
      return;
    }
    const results = {
      name: schema.name,
      singular: schema.singular,
      plural: schema.plural,
      description: schema.description || '',
      icon: schema.icon || '',
      group: schema.group || '',
      columns: schema.columns || [],
      relations: schema.relations || [],
      rest: schema.rest || {}
    };
    const schemaFile = path.join(schemaFolder, `${schema.name}.json`);
    fs.writeFileSync(schemaFile, JSON.stringify(results, null, 2));
    res.json({ error: false, results });
  });

  //update
  ctx.put('/api/schema/:name', async (req, res) => {
    const schema = await parseJSONBody<SchemaConfig>(req.resource);
    const errors = validate(schema, true);
    if (Object.keys(errors).length) {
      res.json({ error: true, errors });
      return;
    }

    const { params } = req.route('/api/schema/:name', true);
    if (!params.name) {
      res.setStatus(404, 'Not Found');
      res.json({ error: true, message: 'Schema not found' });
      return;
    }

    const results = {
      name: schema.name,
      singular: schema.singular,
      plural: schema.plural,
      description: schema.description || '',
      icon: schema.icon || '',
      group: schema.group || '',
      columns: schema.columns || [],
      relations: schema.relations || [],
      rest: schema.rest || {}
    };
    const schemaFile = path.join(schemaFolder, `${params.name}.json`);
    fs.writeFileSync(schemaFile, JSON.stringify(results, null, 2));
    res.json({ error: false, results });
  });

  //remove
  ctx.delete('/api/schema/:name', (req, res) => {
    const { params } = req.route('/api/schema/:name', true);
    if (!params.name) {
      res.setStatus(404, 'Not Found');
      res.json({ error: true, message: 'Schema not found' });
      return;
    }
    const schemaFile = path.join(schemaFolder, `${params.name}.json`);
    //read file before deleting
    const schema = Loader.require(schemaFile);
    fs.unlinkSync(schemaFile);
    res.json({ error: false, results: schema });
  });
};
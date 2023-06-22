import type { IncomingMessage } from 'http';
import type { FieldsetConfig } from 'inceptjs';

import fs from 'fs';
import path from 'path';
import { Framework } from 'inceptjs';
import Loader from '../types/Loader';
import Exception from '../types/Exception';
import { api } from 'inceptjs/api';

const parseJSONBody: <T = any>(im?: IncomingMessage) => Promise<T> = im => {
  return new Promise((resolve, reject) => {
    if (!im) {
      reject(Exception.for('No incoming message'));
      return;
    }
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
  const fieldsetFolder = Loader.fieldsets(ctx.config);
  //search
  ctx.get('/api/fieldset', (req, res) => {
    const fieldsets: Record<string, FieldsetConfig> = {};
    //read all files in the fieldset folder
    fs.readdirSync(fieldsetFolder).filter(
      file => file.endsWith('.json')
    //parse each file as json
    ).forEach(file => {
      if (fs.lstatSync(path.join(fieldsetFolder, file)).isDirectory()) {
        return;
      }

      const fieldset = Loader.require(path.join(fieldsetFolder, file));
      if (typeof fieldset !== 'object') {
        return;
      }
      fieldsets[fieldset.name] = fieldset;
    });
    res.json({ error: false, results: fieldsets });
  });

  //create
  ctx.post('/api/fieldset', async (req, res) => {
    const fieldset = await parseJSONBody<FieldsetConfig>(req.resource);
    const errors = api.validate.fieldset(fieldset, true);
    if (Object.keys(errors).length) {
      res.json({ error: true, errors });
      return;
    }
    const results = {
      name: fieldset.name,
      singular: fieldset.singular,
      plural: fieldset.plural,
      icon: fieldset.icon || '',
      columns: fieldset.columns || []
    };
    const fieldsetFile = path.join(fieldsetFolder, `${fieldset.name}.json`);
    fs.writeFileSync(fieldsetFile, JSON.stringify(results, null, 2));
    res.json({ error: false, results });
  });

  //update
  ctx.put('/api/fieldset/:name', async (req, res) => {
    const fieldset = await parseJSONBody<FieldsetConfig>(req.resource);
    const errors = api.validate.fieldset(fieldset, true);
    if (Object.keys(errors).length) {
      res.json({ error: true, errors });
      return;
    }

    const { params } = req.route('/api/fieldset/:name', true);
    if (!params.name) {
      res.setStatus(404, 'Not Found');
      res.json({ error: true, message: 'Fieldset not found' });
      return;
    }

    const results = {
      name: fieldset.name,
      singular: fieldset.singular,
      plural: fieldset.plural,
      icon: fieldset.icon || '',
      columns: fieldset.columns || []
    };
    const fieldsetFile = path.join(fieldsetFolder, `${params.name}.json`);
    fs.writeFileSync(fieldsetFile, JSON.stringify(results, null, 2));
    res.json({ error: false, results });
  });

  //remove
  ctx.delete('/api/fieldset/:name', (req, res) => {
    const { params } = req.route('/api/fieldset/:name', true);
    if (!params.name) {
      res.setStatus(404, 'Not Found');
      res.json({ error: true, message: 'Fieldset not found' });
      return;
    }
    const fieldsetFile = path.join(fieldsetFolder, `${params.name}.json`);
    //read file before deleting
    const fieldset = Loader.require(fieldsetFile);
    fs.unlinkSync(fieldsetFile);
    res.json({ error: false, results: fieldset });
  });
};
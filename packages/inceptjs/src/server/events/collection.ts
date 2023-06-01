import type { NestedObject, ScalarType } from '../../types';

import Exception from '../types/Exception';
import Schema from '../types/Schema';

import app from '../app';

app.on('system-collection-create', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //validate data
  const rows = ((
    req.params.rows && typeof Array.isArray(req.params.rows)
  ) ? req.params.rows : []) as NestedObject<ScalarType>[];
  const errors = rows.map(data => {
    return schema.errors(data, true);
  }).filter(error => Object.keys(error).length);
  if (errors.length) {
    throw Exception.forErrorsFound(errors);
  }
  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('rows', rows.map(data => schema.prepare(data)));
  //let the system store handle the request
  await app.emit('system-store-insert', request, res);
});

app.on('system-collection-remove', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('filters', req.params.filters || {});
  //let the system store handle the request
  await app.emit('system-store-delete', request, res);
});

app.on('system-collection-search', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //make columns (default add all columns)
  const columns = schema.columns.map(column => column.name).filter(
    name => !Array.isArray(req.params.columns) || req.params.columns.includes(name)
  );
  //make relations (default add no relations)
  const relations = (() => {
    if (!Array.isArray(req.params.relations)) return [];
    const map = req.params.relations as string[];
    return Object.keys(schema.relations).filter(
      name => map.includes(schema.relations[name].schema)
    );
  })();
  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('columns', columns);
  request.stage('relations', relations);
  request.stage('filters', req.params.filters || {});
  request.stage('start', req.params.start || 0);
  request.stage('range', req.params.range || 50);
  //let the system store handle the request
  await app.emit('system-store-search', request, res);
});

app.on('system-collection-update', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //validate data
  const rows = ((
    req.params.rows && typeof Array.isArray(req.params.rows)
  ) ? req.params.rows : []) as NestedObject<ScalarType>[];
  const errors = rows.map(data => {
    return schema.errors(data, true);
  }).filter(error => Object.keys(error).length);
  if (errors.length) {
    throw Exception.forErrorsFound(errors);
  }

  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('rows', rows.map(data => schema.prepare(data)));
  request.stage('filters', req.params.filters || {});
  //let the system store handle the request
  await app.emit('system-store-delete', request, res);
});
import type { NestedObject, ScalarType } from '../../types';

import Exception from '../types/Exception';
import Schema from '../types/Schema';

import app from '../app';

/**
 * Creates a new object
 */
app.on('system-object-create', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //validate data
  const data: NestedObject<ScalarType> = (
    req.params.data && typeof req.params.data === 'object'
  ) ? req.params.data : {};
  const errors = schema.errors(data, true);
  if (Object.keys(errors).length) {
    throw Exception.forErrorsFound(errors);
  }
  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('data', schema.prepare(data));
  //let the system store handle the request
  await app.emit('system-store-insert', request, res);
});

/**
 * Returns an object
 */
app.on('system-object-detail', async (req, res) => {
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
  //make filters
  const filters: Record<string, string|number> = {};
  schema.primary.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  schema.unique.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  if (Object.keys(filters).length === 0) {
    throw Exception.for('No ID provided');
  }

  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('columns', columns);
  request.stage('relations', relations);
  request.stage('filters', filters);
  request.stage('start', 0);
  request.stage('range', 1);
  //let the system store handle the request
  await app.emit('system-store-insert', request, res);
});

/**
 * Deletes an object
 */
app.on('system-object-remove', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //make filters
  const filters: Record<string, string|number> = {};
  schema.primary.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  schema.unique.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  if (Object.keys(filters).length === 0) {
    throw Exception.for('No ID provided');
  }

  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('filters', filters);
  //let the system store handle the request
  await app.emit('system-store-delete', request, res);
});

/**
 * Updates an object
 */
app.on('system-object-update', async (req, res) => {
  //do nothing if there is already a response
  if (res.get()) return;
  //schema is required
  if (typeof req.params.schema !== 'string') {
    throw Exception.forErrorsFound({ schema: 'required' });
  }
  //load schema
  const schema = new Schema(req.params.schema);
  //validate data
  const data = (
    req.params.data && typeof req.params.data === 'object'
  ) ? req.params.data : {};
  const errors = schema.errors(data, false);
  if (Object.keys(errors).length) {
    throw Exception.forErrorsFound(errors);
  }
  //make filters
  const filters: Record<string, string|number> = {};
  schema.primary.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  schema.unique.forEach(column => {
    if (req.params[column.name]) {
      filters[column.name] = req.params[column.name] as string|number;
    }
  });
  if (Object.keys(filters).length === 0) {
    throw Exception.for('No ID provided');
  }

  //prepare data
  const request = req.clone(false);
  request.stage('table', schema.name);
  request.stage('data', schema.prepare(req.params));
  request.stage('filters', filters);
  //let the system store handle the request
  await app.emit('system-store-update', request, res);
});
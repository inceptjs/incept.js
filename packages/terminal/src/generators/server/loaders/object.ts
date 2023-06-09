//types
import type { Project, Directory } from 'ts-morph';

import { VariableDeclarationKind } from 'ts-morph';
import { formatCode } from '../../utils';

export default function generateBootObject(project: Project|Directory) {
  const path = 'loaders/object.ts';
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { NestedObject, ScalarType } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'NestedObject', 'ScalarType', 'Framework' ],
    moduleSpecifier: 'inceptjs'
  });
  //import { Schema, Exception } from 'inceptjs';
  source.addImportDeclaration({
    namedImports: [ 'Schema', 'Exception' ],
    moduleSpecifier: 'inceptjs'
  });
  //const store = process.env.DATABASE_STORE;
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'store',
      initializer: ' process.env.DATABASE_STORE'
    }]
  });
  
  //export default function load(ctx: Framework) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'load',
    parameters: [
      { name: 'ctx', type: 'Framework' }
    ],
    statements: formatCode(`
      ctx.on('system-object-create', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const data: NestedObject<ScalarType> = (
          req.params.data && typeof req.params.data === 'object'
        ) ? req.params.data : {};
        const errors = schema.errors(data, true);
        if (Object.keys(errors).length) {
          throw Exception.forErrorsFound(errors);
        }
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('data', schema.prepare(data));
        await ctx.emit('system-store-collection-insert', request, res);
      });

      ctx.on('system-object-detail', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const columns = schema.columns.map(column => column.name).filter(
          name => !Array.isArray(req.params.columns) || req.params.columns.includes(name)
        );
        const relations = (() => {
          if (!Array.isArray(req.params.relations)) return [];
          const map = req.params.relations as string[];
          return Object.keys(schema.relations).filter(
            name => map.includes(schema.relations[name].schema)
          );
        })();
        const filters: [string, (string|number)[]] = [];
        schema.primary.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        schema.unique.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        if (filters.length === 0) {
          throw Exception.for('No ID provided');
        }
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('columns', columns);
        request.stage('relations', relations);
        request.stage('filters', filters);
        request.stage('offset', 0);
        request.stage('limit', 1);
        await ctx.emit('system-store-collection-select', request, res);
      });
    
      ctx.on('system-object-remove', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const filters: [string, (string|number)[]] = [];
        schema.primary.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        schema.unique.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        if (filters.length === 0) {
          throw Exception.for('No ID provided');
        }
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('filters', filters);
        await ctx.emit('system-store-collection-delete', request, res);
      });
    
      ctx.on('system-object-update', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const data = (
          req.params.data && typeof req.params.data === 'object'
        ) ? req.params.data : {};
        const errors = schema.errors(data, false);
        if (Object.keys(errors).length) {
          throw Exception.forErrorsFound(errors);
        }
        const filters: [string, (string|number)[]] = [];
        schema.primary.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        schema.unique.forEach(column => {
          if (req.params[column.name]) {
            filters.push(
              [ ${'`${column.name} = ?`'}, 
              [ req.params[column.name] as string|number ] 
            ]);
          }
        });
        if (filters.length === 0) {
          throw Exception.for('No ID provided');
        }
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('data', schema.prepare(req.params));
        request.stage('filters', filters);
        await ctx.emit('system-store-collection-update', request, res);
      });
    `)
  });
};
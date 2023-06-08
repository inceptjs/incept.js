//types
import type { Project, Directory } from 'ts-morph';

import { VariableDeclarationKind } from 'ts-morph';
import { formatCode } from '../../utils';

export default function generateBootCollection(project: Project|Directory) {
  const path = 'loaders/collection.ts';
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
  //const store = process.env.DATABASE_NAME;
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'store',
      initializer: ' process.env.DATABASE_NAME'
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
      ctx.on('system-collection-create', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const rows = ((
          req.params.rows && typeof Array.isArray(req.params.rows)
        ) ? req.params.rows : []) as NestedObject<ScalarType>[];
        const errors = rows.map(data => {
          return schema.errors(data, true);
        }).filter(error => Object.keys(error).length);
        if (errors.length) {
          throw Exception.forErrorsFound(errors);
        }
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('data', rows.map(data => schema.prepare(data)));
        await ctx.emit('system-store-collection-insert', request, res);
      });
    
      ctx.on('system-collection-remove', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const filters = Object.keys(req.params.filters || {}).map(key => {
          if (Array.isArray(req.params.filters[key])) {
            if (req.params.filters[key][0] && req.params.filters[key][1]) {
              return [${'`${key} BETWEEN ? AND ?`'}, req.params.filters[key]];
            } else if (req.params.filters[key][0]) {
              return [${'`${key} >= ?`'}, [req.params.filters[key][0]]];
            } else if (req.params.filters[key][1]) {
              return [${'`${key} <= ?`'}, [req.params.filters[key][1]]];
            }
          } else if (req.params.filters[key] === 'true' || req.params.filters[key] === 'false' || req.params.filters[key] === 'null') {
            return ${'`${key} = ${req.params.filters[key]}`'};
          } else if (typeof req.params.filters[key] === 'string' || typeof req.params.filters[key] === 'number') {
            return [${'`${key} = ?`'}, [req.params.filters[key]]];
          }
        });
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('filters', filters.filter(Boolean));
        await ctx.emit('system-store-collection-delete', request, res);
      });
    
      ctx.on('system-collection-search', async (req, res) => {
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
        const filters = Object.keys(req.params.filters || {}).map(key => {
          if (Array.isArray(req.params.filters[key])) {
            if (req.params.filters[key][0] && req.params.filters[key][1]) {
              return [${'`${key} BETWEEN ? AND ?`'}, req.params.filters[key]];
            } else if (req.params.filters[key][0]) {
              return [${'`${key} >= ?`'}, [req.params.filters[key][0]]];
            } else if (req.params.filters[key][1]) {
              return [${'`${key} <= ?`'}, [req.params.filters[key][1]]];
            }
          } else if (req.params.filters[key] === 'true' || req.params.filters[key] === 'false' || req.params.filters[key] === 'null') {
            return ${'`${key} = ${req.params.filters[key]}`'};
          } else if (typeof req.params.filters[key] === 'string' || typeof req.params.filters[key] === 'number') {
            return [${'`${key} = ?`'}, [req.params.filters[key]]];
          }
        });
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('columns', columns);
        request.stage('relations', relations);
        request.stage('filters', filters.filter(Boolean));
        request.stage('offset', req.params.offset || 0);
        request.stage('limit', req.params.limit || 50);
        await ctx.emit('system-store-collection-select', request, res);
      });
    
      ctx.on('system-collection-update', async (req, res) => {
        if (res.get()) return;
        if (typeof req.params.schema !== 'string') {
          throw Exception.forErrorsFound({ schema: 'required' });
        }
        const schema = new Schema(req.params.schema);
        const rows = ((
          req.params.rows && typeof Array.isArray(req.params.rows)
        ) ? req.params.rows : []) as NestedObject<ScalarType>[];
        const errors = rows.map(data => {
          return schema.errors(data, true);
        }).filter(error => Object.keys(error).length);
        if (errors.length) {
          throw Exception.forErrorsFound(errors);
        }
        const filters = Object.keys(req.params.filters || {}).map(key => {
          if (Array.isArray(req.params.filters[key])) {
            if (req.params.filters[key][0] && req.params.filters[key][1]) {
              return [${'`${key} BETWEEN ? AND ?`'}, req.params.filters[key]];
            } else if (req.params.filters[key][0]) {
              return [${'`${key} >= ?`'}, [req.params.filters[key][0]]];
            } else if (req.params.filters[key][1]) {
              return [${'`${key} <= ?`'}, [req.params.filters[key][1]]];
            }
          } else if (req.params.filters[key] === 'true' || req.params.filters[key] === 'false' || req.params.filters[key] === 'null') {
            return ${'`${key} = ${req.params.filters[key]}`'};
          } else if (typeof req.params.filters[key] === 'string' || typeof req.params.filters[key] === 'number') {
            return [${'`${key} = ?`'}, [req.params.filters[key]]];
          }
        });
        const request = req.clone(false);
        request.stage('store', req.params.store || store);
        request.stage('collection', schema.name);
        request.stage('data', rows.map(data => schema.prepare(data)));
        request.stage('filters', filters.filter(Boolean));
        await ctx.emit('system-store-collection-update', request, res);
      });
    `)
  });
};
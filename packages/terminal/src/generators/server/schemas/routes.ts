//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';

import { Schema } from 'inceptjs';
import { formatCode, getTypeName } from '../../utils';

export default function generateModelRoutes(
  project: Project|Directory,
  schema: SchemaConfig,
) {
  const path = `schemas/${schema.name}/routes.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { Framework } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'Framework' ],
    moduleSpecifier: 'inceptjs'
  });
  //import type { ModelType } from './types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types',
    namedImports: [ getTypeName(schema) ]
  });
  //import { Exception } from 'inceptjs';
  source.addImportDeclaration({
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'Exception' ]
  });
  //import validate from './validate';
  source.addImportDeclaration({
    defaultImport: 'validate',
    moduleSpecifier: './validate'
  });

  //export default function load(ctx: Framework) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'load',
    parameters: [
      { name: 'ctx', type: 'Framework' }
    ],
    statements: formatCode(
      Object.keys(schema.rest).map(name => {
        const rest = schema.rest[name];
        const route = (
          rest.path.includes(':') || rest.path.includes('*')
        ) ? `req.route('${rest.path}', true);`: '';
        if (name === 'create') {
          return (`
            //create
            ctx.${rest.method.toLowerCase()}('${rest.path}', async (req, res) => {
              ${Object.keys(rest.body).map(name => (`
                req.stage('${name}', ${JSON.stringify(rest.body[name])});
              `))}
              ${route}
              const errors = validate(req.params as Partial<${getTypeName(schema)}>, true);
              if (Object.keys(errors).length) {
                throw Exception.forErrorsFound(errors);
              }
              await ctx.emit('${rest.event}', req, res);
            })
          `);
        } else if (name === 'update') {
          return (`
            //update
            ctx.${rest.method.toLowerCase()}('${rest.path}', async (req, res) => {
              ${Object.keys(rest.body).map(name => (`
                req.stage('${name}', ${JSON.stringify(rest.body[name])});
              `))}
              ${route}
              const errors = validate(req.params as Partial<${getTypeName(schema)}>, false);
              if (Object.keys(errors).length) {
                throw Exception.forErrorsFound(errors);
              }
              await ctx.emit('${rest.event}', req, res);
            })
          `);
        } else if (name === 'remove' || name === 'detail') {
          const config = new Schema(schema);
          return (`
            //${name}
            ctx.${rest.method.toLowerCase()}('${rest.path}', async (req, res) => {
              ${Object.keys(rest.body).map(name => (`
                req.stage('${name}', ${JSON.stringify(rest.body[name])});
              `))}
              ${route}
              let hasId = false;
              ${config.primary.length ? (`
                if (${config.primary.map(column => (`req.params.${column.name}`)).join(' && ')}) {
                  hasId = true;
                }
              `): ''}
              ${config.unique.filter(column => !column.data.primary).map(column => (`
                if (req.params.${column.name}) {
                  hasId = true;
                }
              `)).join('\n')}
              if (!hasId) {
                throw Exception.for('Invalid ID');
              }
              await ctx.emit('${rest.event}', req, res);
            })
          `);
        }
        return (`
          //${name}
          ctx.${rest.method.toLowerCase()}('${rest.path}', async (req, res) => {
            ${Object.keys(rest.body).map(name => (`
              req.stage('${name}', ${JSON.stringify(rest.body[name])});
            `))}
            ${route}
            await ctx.emit('${rest.event}', req, res);
          })
        `);
      }).join('\n')
    )
  });
};
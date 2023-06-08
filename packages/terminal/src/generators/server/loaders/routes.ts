//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';

import { formatCode } from '../../utils';

export default function generateBootRoutes(
  project: Project|Directory,
  schemas: Record<string, SchemaConfig>
) {
  const path = 'loaders/routes.ts';
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { Framework } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'Framework' ],
    moduleSpecifier: 'inceptjs'
  });

  //export default function load(ctx: Framework) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'load',
    parameters: [
      { name: 'ctx', type: 'Framework' }
    ],
    statements: formatCode(`
      ${Object.values(schemas).map(schema => {
        return Object.values(schema.rest).map(rest => (`
          ctx.${rest.method.toLowerCase()}('${rest.path}', async (req, res) => {
            ${Object.keys(rest.body).map(name => (`
              req.stage('${name}', ${JSON.stringify(rest.body[name])});
            `))}
            req.route('${rest.path}', true);
            await ctx.emit('${rest.event}', req, res);
          })
        `)).join('\n')
      }).join('\n')}
    `)
  });
};
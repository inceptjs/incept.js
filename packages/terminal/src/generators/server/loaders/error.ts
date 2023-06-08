//types
import type { Project, Directory } from 'ts-morph';

import { formatCode } from '../../utils';

export default function generateBootError(project: Project|Directory) {
  const path = 'loaders/error.ts';
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse, Framework } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'APIResponse', 'Framework' ],
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
      ctx.on('error', (req, res, e) => {
        if (!e) return;
        res.json(e.toJSON() as APIResponse);
      });
    `)
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';

export default function generateBootSchema(
  project: Project|Directory,
  schemas: Record<string, SchemaConfig>
) {
  const path = 'loaders/schema.ts';
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { Framework, SchemaConfig } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    namedImports: [ 'Framework', 'SchemaConfig' ],
    moduleSpecifier: 'inceptjs'
  });

  //import { Schema } from 'inceptjs';
  source.addImportDeclaration({
    namedImports: [ 'Schema' ],
    moduleSpecifier: 'inceptjs'
  });

  //import user from '../schemas/user/schema.json';
  Object.keys(schemas).forEach(name => {
    source.addImportDeclaration({
      defaultImport: name,
      moduleSpecifier: `../schemas/${name}/schema.json`
    });
  });

  //export default function load(ctx: Framework) {}
  source.addFunction({
    isDefaultExport: true,
    name: 'load',
    parameters: [
      { name: 'ctx', type: 'Framework' }
    ],
    statements: Object.keys(schemas).map(name => `Schema.add(${name} as SchemaConfig);`)
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';

export default function generateBootstrap(
  project: Project|Directory, 
  plugins: string[] = [],
  schemas: Record<string, SchemaConfig> = {},
) {
  const path = 'app.ts';
  const source = project.createSourceFile(path, '', { overwrite: true });

  //import { Framework } from 'inceptjs';
  source.addImportDeclaration({
    namedImports: ['Framework'],
    moduleSpecifier: 'inceptjs'
  });
  //import schema from './loaders/schema'
  source.addImportDeclaration({
    defaultImport: 'schema',
    moduleSpecifier: './loaders/schema'
  });
  //import error from './loaders/error'
  source.addImportDeclaration({
    defaultImport: 'error',
    moduleSpecifier: './loaders/error'
  });
  //import object from './loaders/object'
  source.addImportDeclaration({
    defaultImport: 'object',
    moduleSpecifier: './loaders/object'
  });
  //import collection from './loaders/collection'
  source.addImportDeclaration({
    defaultImport: 'collection',
    moduleSpecifier: './loaders/collection'
  });

  //import config from './config.json';
  source.addImportDeclaration({
    defaultImport: 'config',
    moduleSpecifier: './config.json'
  });
  plugins.forEach((file, i) => {
    //import loader1 from '[file]'
    source.addImportDeclaration({
      defaultImport: `loader${i + 1}`,
      moduleSpecifier: file
    });
  });
  Object.keys(schemas).forEach(name => {
    //import userRoutes from './schemas/user/routes'
    source.addImportDeclaration({
      defaultImport: `${name}Routes`,
      moduleSpecifier: `./schemas/${name}/routes`
    });
  });
  //const app = new Framework(config);
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
      name: 'app',
      initializer: 'new Framework(config)'
    }]
  });
  source.addStatements('app.load(schema);');
  source.addStatements('app.load(error);');
  source.addStatements('app.load(object);');
  source.addStatements('app.load(collection);');
  plugins.forEach((file, i) => {
    //app.load(boot1)
    source.addStatements(`app.load(loader${i + 1});`);
  });
  Object.keys(schemas).forEach(name => {
    //app.load(userRoutes)
    source.addStatements(`app.load(${name}Routes);`);
  });
  //export default app;
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'app'
  });
};
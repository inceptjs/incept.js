//types
import type { Project, Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';

export default function generateBootstrap(
  project: Project|Directory, 
  plugins: string[] = []
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
  //import routes from './loaders/routes'
  source.addImportDeclaration({
    defaultImport: 'routes',
    moduleSpecifier: './loaders/routes'
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
  source.addStatements('app.load(routes);');
  plugins.forEach((file, i) => {
    //app.load(boot1)
    source.addStatements(`app.load(loader${i + 1});`);
  });
  //export default app;
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'app'
  });
};
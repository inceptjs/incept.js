//types
import type { Project, Directory } from 'ts-morph';
import { VariableDeclarationKind } from 'ts-morph';

export default function generateInstall(
  project: Project|Directory, 
  plugins: string[] = []
) {
  const path = `index.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import { Framework } from 'inceptjs';
  source.addImportDeclaration({
    namedImports: ['Framework'],
    moduleSpecifier: 'inceptjs'
  });
  //import error from './loaders/error'
  source.addImportDeclaration({
    defaultImport: 'error',
    moduleSpecifier: './loaders/error'
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
  source.addStatements('app.load(error);');
  plugins.forEach((file, i) => {
    //app.load(boot1)
    source.addStatements(`app.load(loader${i + 1});`);
  });
  //export {}
  source.addExportDeclaration({
    namedExports: [ 'app' ]
  });
};
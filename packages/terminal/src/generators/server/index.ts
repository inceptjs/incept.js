//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { capitalize } from '../utils';

export default function generateIndex(
  project: Project|Directory, 
  schemas: Record<string, SchemaConfig>
) {
  const path = `index.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  Object.keys(schemas).forEach((name) => {
    const capital = capitalize(name);
    //import validateUser from './schemas/[model]/validate'
    source.addImportDeclaration({
      defaultImport: `validate${capital}`,
      moduleSpecifier: `./schemas/${name}/validate`
    });
  });
  //import app from './app'
  source.addImportDeclaration({
    defaultImport: 'app',
    moduleSpecifier: './app'
  });
  Object.keys(schemas).forEach((name) => {
    //export type * from './[model]/types'
    source.addExportDeclaration({
      moduleSpecifier: `./schemas/${name}/types`,
      isTypeOnly: true
    });
  });
  //export {}
  source.addExportDeclaration({
    namedExports: [...Object.keys(schemas).map((name) => [
      `validate${capitalize(name)}`
    ]).flat(1), 'app']
  });
};
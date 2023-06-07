//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs/server';
//helpers
import { getTypeName } from '../utils';

export default function generateUseRemove(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useRemove.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const rest = schema.rest.remove;
  //import type { AxiosRequestConfig } from 'axios';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'axios',
    namedImports: [ 'AxiosRequestConfig' ]
  });
  //import type { ModelType } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ getTypeName(schema) ]
  });
  //import useFetch from 'inceptjs/client/useFetch';
  source.addImportDeclaration({
    defaultImport: 'useFetch',
    moduleSpecifier: 'inceptjs/client/useFetch'
  });
  //export default function useRemove(id: string, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useRemove',
    parameters: [
      { name: 'id', type: 'string' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: (`
      const action = useFetch<${getTypeName(schema)}>(
        '${rest.method}', 
        '${rest.path}', 
        options
      );
      const handlers = {
        send() {
          if (action.status === 'fetching') return false;
          action.call({ params: { id } });
        }
      };
      return {
        handlers, 
        reset: action.reset,
        status: action.status,
        response: action.response
      };
    `)
  });
};
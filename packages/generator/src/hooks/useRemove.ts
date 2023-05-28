//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '../../../types';
//helpers
import { getTypeName } from '../../../utils';

export default function generateUseRemove(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useRemove.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
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
  //import useFetch from '@ev3/client/dist/hooks/useFetch';
  source.addImportDeclaration({
    defaultImport: 'useFetch',
    moduleSpecifier: '@ev3/client/dist/hooks/useFetch'
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
      const action = useFetch<${getTypeName(schema)}>('delete', '/api/${schema.name}/%s', options);
      const handlers = {
        send() {
          if (action.status === 'fetching') return false;
          action.call(id);
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
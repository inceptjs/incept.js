//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '../../../types';
//helpers
import { getTypeExtendedName } from '../../../utils';

export default function generateUseView(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useView.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { AxiosRequestConfig } from 'axios';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'axios',
    namedImports: [ 'AxiosRequestConfig' ]
  });
  //import type { ModelTypeExtended } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ getTypeExtendedName(schema) ]
  });
  //import { useEffect } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useEffect' ]
  });
  //import useFetch from '@ev3/client/dist/hooks/useFetch';
  source.addImportDeclaration({
    defaultImport: 'useFetch',
    moduleSpecifier: '@ev3/client/dist/hooks/useFetch'
  });
  //export default function useView(id: string, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useView',
    parameters: [
      { name: 'id', type: 'string' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: (`
      const action = useFetch<${getTypeExtendedName(schema)}>('get', '/api/${schema.name}/%s', options);
      useEffect(() => {
        if (!id) return;
        action.call(id);
      }, [ id ]);
      return {
        reset: action.reset,
        status: action.status,
        response: action.response
      };
    `)
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { getTypeExtendedName } from '../utils';

export default function generateUseRows(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useRows.ts`;
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
  //import { useState, useEffect } from 'react';
  source.addImportDeclaration({
    moduleSpecifier: 'react',
    namedImports: [ 'useState', 'useEffect' ]
  });
  //import useFetch from '@ev3/client/dist/hooks/useFetch';
  source.addImportDeclaration({
    defaultImport: 'useFetch',
    moduleSpecifier: '@ev3/client/dist/hooks/useFetch'
  });
  //import useFilters from '@ev3/client/dist/hooks/useFilters';
  source.addImportDeclaration({
    defaultImport: 'useFilters',
    moduleSpecifier: '@ev3/client/dist/hooks/useFilters'
  });
  //export default function useRows(query: Record<string, any>, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useRows',
    parameters: [
      { name: 'query', type: 'Record<string, any>' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: (`
      const action = useFetch<${getTypeExtendedName(schema)}[]>('get', '/api/${schema.name}', options);
      const { filters, handlers } = useFilters(query);
      const [ last, setLast ] = useState<Record<string, any>>();
      const serialize = (value) => JSON.stringify(value);
      useEffect(() => {
        if (serialize(filters) === serialize(last)) return;
        setLast(filters);
        action.call(filters);
      }, [ filters ]);
      return {
        filters,
        handlers,
        reset: action.reset,
        status: action.status,
        response: action.response
      };
    `)
  });
};
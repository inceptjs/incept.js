//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { getTypeExtendedName, formatCode } from '../../utils';

export default function generateUseSearch(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useSearch.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const rest = schema.rest.search;
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
  //import { useFetch, useFilters } from 'inceptjs';
  source.addImportDeclaration({
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'useFetch', 'useFilters' ]
  });
  //export default function useSearch(query: Record<string, any>, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useSearch',
    parameters: [
      { name: 'query', type: 'Record<string, any>' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: formatCode(`
      const action = useFetch<${getTypeExtendedName(schema)}[]>(
        '${rest.method}', 
        '${rest.path}', 
        options
      );
      const { filters, handlers } = useFilters(query);
      const [ last, setLast ] = useState<Record<string, any>>();
      const serialize = (value: any) => JSON.stringify(value);
      useEffect(() => {
        if (serialize(filters) === serialize(last)) return;
        setLast(filters);
        action.call({ query: filters });
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
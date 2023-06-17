//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { getTypeExtendedName, formatCode } from '../../utils';

export default function generateUseDetail(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const rest = schema.rest.detail;
  if (!rest) return;
  const path = `${schema.name}/hooks/useDetail.ts`;
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
  //import { useFetch } from 'inceptjs';
  source.addImportDeclaration({
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'useFetch' ]
  });
  //export default function useDetail(id: string, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useDetail',
    parameters: [
      { name: 'id', type: 'string' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: formatCode(`
      const action = useFetch<${getTypeExtendedName(schema)}>(
        '${rest.method}', 
        '${rest.path}', 
        options
      );
      useEffect(() => {
        if (!id) return;
        action.call({ params: { id } });
      }, [ id ]);
      return {
        reset: action.reset,
        status: action.status,
        response: action.response
      };
    `)
  });
};
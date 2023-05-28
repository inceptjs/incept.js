//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { getTypeName } from '../utils';

export default function generateUseUpdate(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useUpdate.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FormEvent } from 'react';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'react',
    namedImports: [ 'FormEvent' ]
  });
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
  //import useForm from '@ev3/client/dist/hooks/useForm';
  source.addImportDeclaration({
    defaultImport: 'useForm',
    moduleSpecifier: '@ev3/client/dist/hooks/useForm'
  });
  //import validate from '.ev3/client/[model]/validate';
  source.addImportDeclaration({
    defaultImport: 'validate',
    moduleSpecifier: `.ev3/client/${schema.name}/validate`
  });
  //export default function useUpdate(id: string, options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useUpdate',
    parameters: [
      { name: 'id', type: 'string' },
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: (`
      const action = useFetch<${getTypeName(schema)}>('put', '/api/${schema.name}/%s', options);
      const { input, handlers } = useForm((e: FormEvent) => {
        e.preventDefault();
        if (action.status === 'fetching') {
          return false;
        }
        const errors = validate(input.values, false);
        if (Object.keys(errors).length) {
          action.set({ 
            error: true, 
            code: 400,
            message: 'Invalid Parameters',
            errors: errors
          });
          return false;
        }
        action.call(id, input.values);
        return false;
      });
      const reset = () => {
        input.set({});
        action.reset();
      };
      return {
        handlers,
        reset,
        input: input.values,
        status: action.status,
        response: action.response
      };
    `)
  });
};
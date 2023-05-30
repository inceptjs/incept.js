//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { getTypeName } from '../utils';

export default function generateUseCreate(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/hooks/useCreate.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const rest = schema.rest.create;
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
  //import useFetch from '@inceptjs/client/dist/hooks/useFetch';
  source.addImportDeclaration({
    defaultImport: 'useFetch',
    moduleSpecifier: '@inceptjs/client/dist/hooks/useFetch'
  });
  //import useForm from '@inceptjs/client/dist/hooks/useForm';
  source.addImportDeclaration({
    defaultImport: 'useForm',
    moduleSpecifier: '@inceptjs/client/dist/hooks/useForm'
  });
  //import validate from '../validate';
  source.addImportDeclaration({
    defaultImport: 'validate',
    moduleSpecifier: `../validate`
  });
  //export default function useCreate(options: AxiosRequestConfig = {})
  source.addFunction({
    isDefaultExport: true,
    name: 'useCreate',
    parameters: [
      { name: 'options', type: 'AxiosRequestConfig', initializer: '{}' }
    ],
    statements: (`
      const action = useFetch<${getTypeName(schema)}>(
        '${rest.method}', 
        '${rest.path}', 
        options
      );
      const { input, handlers } = useForm((e: FormEvent) => {
        e.preventDefault();
        if (action.status === 'fetching') {
          return false;
        }
        const errors = validate(input.values, true);
        if (Object.keys(errors).length) {
          action.set({ 
            error: true,
            code: 400,
            message: 'Invalid Parameters',
            errors: errors 
          });
          return false;
        }
        action.call(input.values);
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
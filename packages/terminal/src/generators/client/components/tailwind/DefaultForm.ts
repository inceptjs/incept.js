//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { 
  capitalize, 
  getTypeName, 
  getTypeExtendedName,
  formatCode
} from '../../../utils';

export default function generateTailwindDefaultForm(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultForm.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse, FetchStatuses, FormHandlers } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'APIResponse', 'FetchStatuses', 'FormHandlers' ]
  });
  //import type { ModelType } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ 
      getTypeName(schema), 
      getTypeExtendedName(schema) 
    ].filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  //import { useLanguage } from '@inceptjs/translate';
  source.addImportDeclaration({
    moduleSpecifier: '@inceptjs/translate',
    namedImports: [ 'useLanguage' ]
  });
  //import Loader from '@inceptjs/tailwind/dist/Loader';
  source.addImportDeclaration({
    defaultImport: 'Loader',
    moduleSpecifier: '@inceptjs/tailwind/dist/Loader'
  });
  //import Button from '@inceptjs/tailwind/dist/Button';
  source.addImportDeclaration({
    defaultImport: 'Button',
    moduleSpecifier: '@inceptjs/tailwind/dist/Button'
  });
  //import { RoleField, ActiveField, ... } from './FormFields';
  source.addImportDeclaration({
    moduleSpecifier: `./FormFields`,
    namedImports: schema.columns
      .filter(column => column.field.method !== 'none')
      .map(column => `${capitalize(column.name)}Field`)
  });
  //export type DefaultFormProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultFormProps',
    type: formatCode(`{
      handlers: FormHandlers,
      data?: Partial<${getTypeName(schema)}>|Partial<${getTypeExtendedName(schema)}>,
      response?: APIResponse<${getTypeExtendedName(schema)}>,
      status: FetchStatuses
    }`)
  });
  //export default function DefaultForm(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultForm',
    parameters: [
      { name: 'props', type: 'DefaultFormProps' }
    ],
    returnType: 'React.ReactElement',
    statements: formatCode(`
      const { handlers, data, response, status } = props;
      const { _ } = useLanguage();
      return React.createElement(
        'form',
        { onSubmit: handlers.send },
        ${schema.columns.filter(
          (column) => column.field.method !== 'none'
        ).map((column, i) => (`
          React.createElement(
            'div',
            { className: 'mt-2 relative z-[${5000 - (i + 1)}]' },
            React.createElement(
              ${capitalize(column.name)}Field,
              {
                label: _('${column.label}'),
                error: response?.errors?.${column.name},
                change: handlers.change,
                defaultValue: data?.${column.name}
              }
            )
          ),
        `)).join('\n')}
        React.createElement(Button, {
          type: 'submit',
          info: true,
          className: 'mt-4',
          disabled: status === 'fetching',
          children: status === 'fetching' 
            ? React.createElement(Loader) 
            : _('Submit'),
        })
      );
    `)
  });
};
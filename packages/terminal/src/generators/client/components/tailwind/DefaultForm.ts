//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { api } from 'inceptjs/api';
import { 
  capitalize, 
  camelfy,
  getTypeName, 
  getTypeExtendedName,
  formatCode
} from '../../../utils';

export default function generateTailwindDefaultForm(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultForm.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const fields = api.field.list();
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
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Loader from 'frui/tailwind/Loader';
  source.addImportDeclaration({
    defaultImport: 'Loader',
    moduleSpecifier: 'frui/tailwind/Loader'
  });
  //import Button from 'frui/tailwind/Button';
  source.addImportDeclaration({
    defaultImport: 'Button',
    moduleSpecifier: 'frui/tailwind/Button'
  });
  //import { RoleField, ActiveField, ... } from './FormFields';
  source.addImportDeclaration({
    moduleSpecifier: `./FormFields`,
    namedImports: schema.columns
      .filter(column => fields[column.field.method].component)
      .map(column => `${capitalize(camelfy(column.name))}Field`)
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
          (column) => fields[column.field.method].component
        ).map((column, i) => (`
          React.createElement(
            'div',
            { className: 'mt-2 relative z-[${5000 - (i + 1)}]' },
            React.createElement(
              ${capitalize(camelfy(column.name))}Field,
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
          disabled: status === 'fetching'
        }, status === 'fetching' ? React.createElement(Loader) : _('Submit'))
      );
    `)
  });
};
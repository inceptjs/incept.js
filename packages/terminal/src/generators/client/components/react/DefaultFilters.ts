//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { 
  capitalize, 
  getTypeExtendedName,
  formatCode
} from '../../../utils';

export default function generateTailwindDefaultFilters(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultFilters.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse, FetchStatuses, FilterHandlers } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'FetchStatuses', 'FilterHandlers' ]
  });
  //import type { ModelType } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '../types',
    namedImports: [ getTypeExtendedName(schema) ]
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
  //import Loader from '@inceptjs/react/dist/Loader';
  source.addImportDeclaration({
    defaultImport: 'Loader',
    moduleSpecifier: '@inceptjs/react/dist/Loader'
  });
  //import Button from '@inceptjs/react/dist/Button';
  source.addImportDeclaration({
    defaultImport: 'Button',
    moduleSpecifier: '@inceptjs/react/dist/Button'
  });
  //import { RoleFilter, ActiveFilter, ... } from './FilterFields';
  source.addImportDeclaration({
    moduleSpecifier: `./FilterFields`,
    namedImports: schema.columns
      .filter(column => column.filterable && column.field.method !== 'none')
      .map(column => `${capitalize(column.name)}Filter`)
  });
  //export type DefaultFiltersProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultFiltersProps',
    type: formatCode(`{
      handlers: FilterHandlers,
      data?: Record<string, string|number>,
      response?: APIResponse<${getTypeExtendedName(schema)}>,
      status: FetchStatuses
    }`)
  });
  //export default function DefaultFilters(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultFilters',
    parameters: [
      { name: 'props', type: 'DefaultFiltersProps' }
    ],
    returnType: 'React.ReactElement',
    statements: formatCode(`
      const { handlers, data, response, status } = props;
      const { _ } = useLanguage();
      return React.createElement(
        'form',
        { onSubmit: handlers.send },
        ${schema.columns.filter(
          (column) => column.filterable && column.field.method !== 'none'
        ).map((column, i) => (`
          React.createElement(
            'div',
            { style: { marginTop: '8px', position: 'relative', zIndex: ${5000 - (i + 1)} } },
            React.createElement(
              ${capitalize(column.name)}Filter,
              {
                label: _('By ${column.label}'),
                error: response?.errors?.${column.name},
                filter: handlers.filter,
                defaultValue: data ? data['filter[${column.name}]'] : undefined,
              }
            )
          ),
        `)).join('\n')}
        React.createElement(Button, {
          type: 'submit',
          { style: { marginTop: '8px' } },
          disabled: status === 'fetching',
          children: status === 'fetching' ?
            React.createElement(Loader) :
            _('Filter'),
        })
      );
    `)
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { 
  capitalize, 
  camelfy,
  getTypeExtendedName,
  formatCode
} from '../../../utils';

export default function generateTailwindDefaultFilters(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultFilters.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse, FetchStatuses, FilterHandlers } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'APIResponse', 'FetchStatuses', 'FilterHandlers' ]
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
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import Loader from 'frui/react/Loader';
  source.addImportDeclaration({
    defaultImport: 'Loader',
    moduleSpecifier: 'frui/react/Loader'
  });
  //import Button from 'frui/react/Button';
  source.addImportDeclaration({
    defaultImport: 'Button',
    moduleSpecifier: 'frui/react/Button'
  });
  //import { RoleFilter, ActiveFilter, ... } from './FilterFields';
  source.addImportDeclaration({
    moduleSpecifier: `./FilterFields`,
    namedImports: schema.columns
      .filter(column => column.filterable && column.field.method !== 'none')
      .map(column => `${capitalize(camelfy(column.name))}Filter`)
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
              ${capitalize(camelfy(column.name))}Filter,
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
          style: { marginTop: '8px' },
          disabled: status === 'fetching'
        }, status === 'fetching' ? React.createElement(Loader) : _('Filter'))
      );
    `)
  });
};
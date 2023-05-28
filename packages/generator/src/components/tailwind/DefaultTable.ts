//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { capitalize, getTypeExtendedName } from '../../utils';

export default function generateTailwindDefaultTable(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultTable.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FilterHandlers } from '@ev3/client/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@ev3/client/dist/types',
    namedImports: [ 'FilterHandlers' ]
  });
  //import type { ModelTypeExtended } from '../types';
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
  //import { useLanguage } from '@ev3/i18n';
  source.addImportDeclaration({
    moduleSpecifier: '@ev3/i18n',
    namedImports: [ 'useLanguage' ]
  });
  //import useStripe from '@ev3/client/dist/hooks/useStripe';
  source.addImportDeclaration({
    defaultImport: 'useStripe',
    moduleSpecifier: '@ev3/client/dist/hooks/useStripe'
  });
  //import { Table, Thead, Trow, Tcol } from '@ev3/ui/dist/tailwind/Table';
  source.addImportDeclaration({
    moduleSpecifier: '@ev3/ui/dist/tailwind/Table',
    namedImports: [ 'Table', 'Thead', 'Trow', 'Tcol' ]
  });
  //import { RoleFormat, ActiveFormat, ... } from './ListFormats';
  source.addImportDeclaration({
    moduleSpecifier: `./ListFormats`,
    namedImports: schema.columns
      .filter(column => column.list.method !== 'hide')
      .map(column => `${capitalize(column.name)}Format`)
  });
  //export type DefaultTableProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultTableProps',
    type: `{
      filters: Record<string, any>,
      handlers: FilterHandlers,
      stripes: [string, string],
      rows?: ${getTypeExtendedName(schema)}[]
    }`
  });
  //export default function DefaultTable(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultTable',
    parameters: [
      { name: 'props', type: 'DefaultTableProps' }
    ],
    returnType: 'React.ReactElement',
    statements: (`
      const { filters, handlers, stripes, rows } = props
      const { _ } = useLanguage();
      const stripe = useStripe(stripes[0], stripes[1]);
      return React.createElement(
        Table,
        ${schema.columns.filter(
          (column) => column.list.method !== 'hide'
        ).map((column) => {
          if (column.sortable) {
            return (`
              React.createElement(
                Thead,
                {
                  className: 'text-right text-blue-600',
                  noWrap: true,
                  stickyTop: true,
                  stickyLeft: ${column.list.sticky ? 'true': 'false'}
                },
                React.createElement(
                  'span',
                  { className: 'cursor-pointer', onClick: () => handlers.sort('${column.name}') },
                  _('${column.label}')
                ),
                !filters['sort[${column.name}]'] ? React.createElement(
                  'i', { className: 'ml-1 text-xs fas fa-sort' }
                ): null,
                filters['sort[${column.name}]'] === 'asc' ? React.createElement(
                  'i', { className: 'ml-1 text-xs fas fa-sort-up' }
                ): null,
                filters['sort[${column.name}]'] === 'desc' ? React.createElement(
                  'i', { className: 'ml-1 text-xs fas fa-sort-down' }
                ): null
              ),
            `);
          }
          return (`
            React.createElement(
              Thead,
              {
                noWrap: true,
                stickyTop: true,
                stickyLeft: ${column.list.sticky ? 'true': 'false'}
              },
              _('${column.label}')
            ),
          `)
        }).join('\n')}
        rows ? rows.map((data, i) => {
          return React.createElement(
            Trow,
            { key: i },
            ${schema.columns.filter(
              (column) => column.list.method !== 'hide'
            ).map((column) => (`
              React.createElement(
                Tcol,
                { className: \`text-left \${stripe(i)}\` },
                React.createElement(
                  ${capitalize(column.name)}Format,
                  { value: data?.${column.name} }
                )
              )
            `)).join(',\n')}
          )
        }): null
      );
    `)
  });
};
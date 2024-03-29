//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { api } from 'inceptjs/api';
import { 
  capitalize, 
  camelfy,
  getTypeExtendedName,
  formatCode
} from '../../../utils';

export default function generateTailwindDefaultTable(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultTable.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const formats = api.format.list();
  const columns = schema.columns.filter(
    column => formats[column.list.method].component 
      || column.list.method === 'none' 
      || column.list.method === 'escaped'
  );
  //import type { FilterHandlers } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'inceptjs',
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
  //import { useLanguage } from 'r22n';
  source.addImportDeclaration({
    moduleSpecifier: 'r22n',
    namedImports: [ 'useLanguage' ]
  });
  //import { useStripe } from 'inceptjs';
  source.addImportDeclaration({
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'useStripe' ]
  });
  //import { Table, Thead, Trow, Tcol } from 'frui/tailwind/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/tailwind/Table',
    namedImports: [ 'Table', 'Thead', 'Trow', 'Tcol' ]
  });
  if (columns.length) {
    //import { RoleFormat, ActiveFormat, ... } from './ListFormats';
    source.addImportDeclaration({
      moduleSpecifier: `./ListFormats`,
      namedImports: schema.columns
        .filter(column => formats[column.list.method].component 
          || column.list.method === 'none' 
          || column.list.method === 'escaped'
        )
        .map(column => `${capitalize(camelfy(column.name))}Format`)
    });
  }
  
  //export type DefaultTableProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultTableProps',
    type: formatCode(`{
      filters: Record<string, any>,
      handlers: FilterHandlers,
      stripes: [string, string],
      rows?: ${getTypeExtendedName(schema)}[]
    }`)
  });
  //export default function DefaultTable(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultTable',
    parameters: [
      { name: 'props', type: 'DefaultTableProps' }
    ],
    returnType: 'React.ReactElement',
    statements: formatCode(`
      const { filters, handlers, stripes, rows } = props
      const { _ } = useLanguage();
      const stripe = useStripe(stripes[0], stripes[1]);
      return React.createElement(
        Table,
        ${columns.map((column) => {
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
            ${columns.map((column) => (`
              React.createElement(
                Tcol,
                { className: \`text-left \${stripe(i)}\` },
                React.createElement(
                  ${capitalize(camelfy(column.name))}Format,
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
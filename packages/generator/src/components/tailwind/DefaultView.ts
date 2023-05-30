//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { capitalize, getTypeExtendedName } from '../../utils';

export default function generateTailwindDefaultView(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultView.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
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
  //import { useLanguage } from '@inceptjs/translate';
  source.addImportDeclaration({
    moduleSpecifier: '@inceptjs/translate',
    namedImports: [ 'useLanguage' ]
  });
  //import useStripe from '@inceptjs/client/dist/hooks/useStripe';
  source.addImportDeclaration({
    defaultImport: 'useStripe',
    moduleSpecifier: '@inceptjs/client/dist/hooks/useStripe'
  });
  //import { Table, Thead, Trow, Tcol } from '@inceptjs/tailwind/dist/Table';
  source.addImportDeclaration({
    moduleSpecifier: '@inceptjs/tailwind/dist/Table',
    namedImports: [ 'Table', 'Trow', 'Tcol' ]
  });
  //import { RoleFormat, ActiveFormat, ... } from './ListFormats';
  source.addImportDeclaration({
    moduleSpecifier: `./ListFormats`,
    namedImports: schema.columns
      .filter(column => column.view.method !== 'hide')
      .map(column => `${capitalize(column.name)}Format`)
  });
  //export type DefaultViewProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultViewProps',
    type: `{
      stripes: [string, string],
      data?: ${getTypeExtendedName(schema)}
    }`
  });
  //export default function DefaultView(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultView',
    parameters: [
      { name: 'props', type: 'DefaultViewProps' }
    ],
    returnType: 'React.ReactElement',
    statements: (`
      const { stripes, data } = props
      const { _ } = useLanguage();
      const stripe = useStripe(stripes[0], stripes[1]);
      return React.createElement(
        Table,
        ${schema.columns.filter(
          (column) => column.view.method !== 'hide'
        ).map((column) => (`
          React.createElement(
            Trow,
            React.createElement(
              Tcol,
              { className: \`text-left \${stripe(true)}\` },
              _('${column.label}')
            ),
            React.createElement(
              Tcol,
              { className: \`text-left \${stripe()}\` },
              React.createElement(
                ${capitalize(column.name)}Format,
                { value: data?.${column.name} }
              )
            )
          )
        `)).join(',\n')}
      );
    `)
  });
};
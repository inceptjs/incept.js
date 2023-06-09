//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { 
  capitalize, 
  getTypeExtendedName,
  formatCode
} from '../../../utils';

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
  //import { Table, Thead, Trow, Tcol } from 'frui/react/Table';
  source.addImportDeclaration({
    moduleSpecifier: 'frui/react/Table',
    namedImports: [ 'Table', 'Trow', 'Tcol' ]
  });
  //import { RoleFormat, ActiveFormat, ... } from './ListFormats';
  source.addImportDeclaration({
    moduleSpecifier: `./ViewFormats`,
    namedImports: schema.columns
      .filter(column => column.view.method !== 'hide')
      .map(column => `${capitalize(column.name)}Format`)
  });
  //export type DefaultViewProps
  source.addTypeAlias({
    isExported: true,
    name: 'DefaultViewProps',
    type: formatCode(`{
      stripes: [string, string],
      data?: ${getTypeExtendedName(schema)}
    }`)
  });
  //export default function DefaultView(props: )
  source.addFunction({
    isDefaultExport: true,
    name: 'DefaultView',
    parameters: [
      { name: 'props', type: 'DefaultViewProps' }
    ],
    returnType: 'React.ReactElement',
    statements: formatCode(`
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
              { style: { textAlign: 'left', backgroundColor: stripe(true) } },
              _('${column.label}')
            ),
            React.createElement(
              Tcol,
              { style: { textAlign: 'left', backgroundColor: stripe() } },
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
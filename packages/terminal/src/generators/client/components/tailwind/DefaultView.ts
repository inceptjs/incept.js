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

export default function generateTailwindDefaultView(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/components/DefaultView.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const formats = api.format.list();
  const columns = schema.columns.filter(
    column => formats[column.view.method].component
      || column.view.method === 'none' 
      || column.view.method === 'escaped'
  );
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
    namedImports: [ 'Table', 'Trow', 'Tcol' ]
  });
  if (columns.length) {
    //import { RoleFormat, ActiveFormat, ... } from './ListFormats';
    source.addImportDeclaration({
      moduleSpecifier: `./ViewFormats`,
      namedImports: columns.map(
        column => `${capitalize(camelfy(column.name))}Format`
      )
    });
  }
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
        ${columns.map((column) => (`
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
                ${capitalize(camelfy(column.name))}Format,
                { value: data?.${column.name} }
              )
            )
          )
        `)).join(',\n')}
      );
    `)
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { formats } from '../tokens';
import { capitalize } from '../utils';

export default function generateViewFormats(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/ViewFormats.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FieldSelectProps, FieldInputProps } from '@ev3/ui/dist/types'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@ev3/ui/dist/types',
    namedImports: schema.columns
    .filter(column => !!formats[column.view.method])
    .map(column => `${formats[column.view.method]}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  schema.columns
    .filter(column => !!formats[column.view.method])
    .map(column => formats[column.view.method])
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((defaultImport) => {
      //import Control from '@ev3/ui/dist/tailwind/Control';
      source.addImportDeclaration({ 
        defaultImport, 
        moduleSpecifier: `@ev3/ui/dist/${ui}/${defaultImport}` 
      });
    });
  //export type FormatComponentProps
  source.addTypeAlias({
    isExported: true,
    name: 'FormatComponentProps',
    type: 'Record<string, any>'
  });
  //export NameFormat: (props: FormatComponentProps) => React.ReactElement
  schema.columns.filter(
    (column) => !!formats[column.view.method] || column.view.method === 'none'
  ).forEach((column) => {
    source.addFunction({
      isExported: true,
      name: `${capitalize(column.name)}Format`,
      parameters: [
        { name: 'props', type: 'FormatComponentProps' }
      ],
      returnType: 'React.ReactElement',
      statements: column.view.method === 'none' ? (`
        return props.value;
      `) : (`
        const { value, ...others } = props;
        const attributes: ${formats[column.view.method]}Props = Object.assign(
          ${JSON.stringify(column.view.attributes || {}, null, 2)},
          { value },
          others || {}
        );
        return React.createElement(
          ${formats[column.view.method]},
          attributes
        );
      `)
    });
  });
  //export default
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
        name: 'ViewFormats',
        initializer: `{
          ${schema.columns
            .filter((column) => !!formats[column.view.method] || column.view.method === 'none')
            .map((column) => `${capitalize(column.name)}Format`)
            .join(',\n')}
        }`,
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'ViewFormats'
  });
};
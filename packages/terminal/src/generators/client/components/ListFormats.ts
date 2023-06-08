//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { formats } from '@inceptjs/react/dist/tokens';
import { capitalize, formatCode } from '../../utils';

export default function generateListFormats(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/ListFormats.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FieldSelectProps, FieldInputProps } from '@inceptjs/react'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@inceptjs/react',
    namedImports: schema.columns
    .filter(column => !!formats[column.list.method])
    .map(column => `${formats[column.list.method].component}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  schema.columns
    .filter(column => !!formats[column.list.method])
    .map(column => formats[column.list.method].component)
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((defaultImport) => {
      //import Control from '@inceptjs/tailwind/dist/Control';
      source.addImportDeclaration({ 
        defaultImport, 
        moduleSpecifier: `@inceptjs/${ui}/dist/${defaultImport}` 
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
    (column) => !!formats[column.list.method] || column.list.method === 'none'
  ).forEach((column) => {
    source.addFunction({
      isExported: true,
      name: `${capitalize(column.name)}Format`,
      parameters: [
        { name: 'props', type: 'FormatComponentProps' }
      ],
      returnType: 'React.ReactElement',
      statements: column.list.method === 'none' ? formatCode(`
        return props.value;
      `) : formatCode(`
        const { value, ...others } = props;
        const attributes: ${formats[column.list.method].component}Props = Object.assign(
          ${JSON.stringify(column.list.attributes || {}, null, 2)},
          { value },
          others || {}
        );
        return React.createElement(
          ${formats[column.list.method].component},
          attributes
        );
      `)
    });
  });

  //export default
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
        name: 'ListFormats',
        initializer: formatCode(`{
          ${schema.columns
            .filter((column) => !!formats[column.list.method] || column.list.method === 'none')
            .map((column) => `${capitalize(column.name)}Format`)
            .join(',\n')}
        }`),
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'ListFormats'
  });
};
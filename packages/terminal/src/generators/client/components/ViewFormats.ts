//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { api } from 'inceptjs/api';
import { capitalize, camelfy, formatCode } from '../../utils';

export default function generateViewFormats(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/ViewFormats.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const formats = api.format.list();
  const columns = schema.columns.filter(
    column => !!formats[column.view.method].component
  );
  const columnsNone = schema.columns.filter(
    (column) => !!formats[column.view.method].component 
      || column.view.method === 'none' 
      || column.view.method === 'escaped'
  );
  //import type { FieldSelectProps, FieldInputProps } from 'frui'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'frui',
    namedImports: columns
    .map(column => `${formats[column.view.method].component}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  columns
    .map(column => formats[column.view.method].component)
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach(defaultImport => {
      if (defaultImport) {
        //import FieldInput from 'frui/tailwind/FieldInput';
        source.addImportDeclaration({ 
          defaultImport, 
          moduleSpecifier: `frui/${ui}/${defaultImport}` 
        });
      }
    });
  //export type FormatComponentProps
  source.addTypeAlias({
    isExported: true,
    name: 'FormatComponentProps',
    type: 'Record<string, any>'
  });
  //export NameFormat: (props: FormatComponentProps) => React.ReactElement
  columnsNone.forEach((column) => {
    source.addFunction({
      isExported: true,
      name: `${capitalize(camelfy(column.name))}Format`,
      parameters: [
        { name: 'props', type: 'FormatComponentProps' }
      ],
      returnType: 'React.ReactElement',
      statements: column.view.method === 'none' 
        || column.view.method === 'escaped' ? formatCode(`
        return props.value;
      `) : formatCode(`
        const { value, ...others } = props;
        const attributes: ${formats[column.view.method].component}Props = Object.assign(
          ${JSON.stringify(column.view.attributes || {}, null, 2)},
          { value },
          others || {}
        );
        return React.createElement(
          ${formats[column.view.method].component},
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
        initializer: formatCode(`{
          ${columnsNone
            .map((column) => `${capitalize(camelfy(column.name))}Format`)
            .join(',\n')}
        }`),
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'ViewFormats'
  });
};
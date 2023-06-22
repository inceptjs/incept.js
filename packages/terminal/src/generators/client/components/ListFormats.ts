//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { api } from 'inceptjs/api';
import { capitalize, camelfy, formatCode } from '../../utils';

export default function generateListFormats(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/ListFormats.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  const formats = api.format.list();
  const columns = schema.columns.filter(
    column => !!formats[column.list.method].component
  );
  const columnsNone = schema.columns.filter(
    (column) => formats[column.list.method].component 
      || column.list.method === 'none' 
      || column.list.method === 'escaped'
  );
  if (columns.length) {
    //import type { FieldSelectProps, FieldInputProps } from 'frui'
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: 'frui',
      namedImports: columns
      .map(column => `${formats[column.list.method].component}Props`)
      .filter((value, index, array) => array.indexOf(value) === index)
    });
  }
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  columns
    .map(column => formats[column.list.method].component)
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
      statements: formats[column.list.method].component ? formatCode(`
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
      `): formatCode(`
        return props.value;
      `)
    });
  });

  //export default
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
        name: 'ListFormats',
        initializer: formatCode(`{
          ${columnsNone
            .map((column) => `${capitalize(camelfy(column.name))}Format`)
            .join(',\n')}
        }`),
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'ListFormats'
  });
};
//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig, SchemaColumn } from '@inceptjs/client/dist/types';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { fields } from '@inceptjs/react/dist/tokens';
import { capitalize } from '../utils';

const isRangeField = (column: SchemaColumn) => [
  'number', 
  'Date'
].indexOf(column.type) >= 0 || [
  'number', 
  'price', 
  'date', 
  'time', 
  'datetime'
].indexOf(column.field.method) >= 0;

export default function generateFilterFields(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/FilterFields.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FieldSelectProps, FieldInputProps } from '@inceptjs/react/dist/types'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@inceptjs/react/dist/types',
    namedImports: schema.columns
    .filter(column => column.filterable && !!fields[column.field.method])
    .map(column => `${fields[column.field.method].component}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  //import Control from '@inceptjs/tailwind/dist/Control';
  source.addImportDeclaration({
    defaultImport: 'Control',
    moduleSpecifier: `@inceptjs/${ui}/dist/Control`
  });
  schema.columns
    .filter(column => column.filterable && !!fields[column.field.method])
    .map(column => fields[column.field.method].component)
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((defaultImport) => {
      //import FieldInput from '@inceptjs/tailwind/dist/FieldInput';
      source.addImportDeclaration({ 
        defaultImport, 
        moduleSpecifier: `@inceptjs/${ui}/dist/${defaultImport}` 
      });
    });

  //export type FilterComponentProps
  source.addTypeAlias({
    isExported: true,
    name: 'FilterComponentProps',
    type: `Record<string, any> & {
      label?: string,
      error?: string,
      filter: (value: Record<string, any>) => void
    }`
  });
  //export NameFilter: (props: FilterComponentProps) => React.ReactElement
  schema.columns.filter(
    (column) => column.filterable && !!fields[column.field.method]
  ).forEach((column) => {
    source.addFunction({
      isExported: true,
      name: `${capitalize(column.name)}Filter`,
      parameters: [
        { name: 'props', type: 'FilterComponentProps' }
      ],
      returnType: 'React.ReactElement',
      statements: isRangeField(column) ? (`
        const { label, error, filter, ...fieldProps } = props;
        const attributes: ${fields[column.field.method].component}Props = Object.assign(
          ${JSON.stringify(column.field.attributes || {}, null, 2)},
          fieldProps
        );
        attributes.error = Boolean(error);
        const minAttributes = Object.assign({}, attributes, {
          onUpdate: value => filter({'filter[${column.name}][0]': value})
        });
        const maxAttributes = Object.assign({}, attributes, {
          onUpdate: value => filter({'filter[${column.name}][1]': value})
        });
        return React.createElement(
          Control,
          { label, error },
          React.createElement(
            ${fields[column.field.method].component},
            minAttributes
          ),
          React.createElement(
            ${fields[column.field.method].component},
            maxAttributes
          )
        );
      `): (`
        const { label, error, filter, ...fieldProps } = props;
        const attributes: ${fields[column.field.method].component}Props = Object.assign(
          ${JSON.stringify(column.field.attributes || {}, null, 2)},
          fieldProps
        );
        attributes.error = Boolean(error);
        attributes.onUpdate = value => filter({'filter[${column.name}]': value});
        return React.createElement(
          Control,
          { label, error },
          React.createElement(
            ${fields[column.field.method].component},
            attributes
          )
        );
      `)
    });
  });
  //export default
  source.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [{
        name: 'FilterFields',
        initializer: `{
          ${schema.columns
            .filter((column) => column.filterable && !!fields[column.field.method])
            .map((column) => `${capitalize(column.name)}Filter`)
            .join(',\n')}
        }`,
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'FilterFields'
  });
};
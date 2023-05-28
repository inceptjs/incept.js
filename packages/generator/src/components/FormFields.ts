//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { fields } from '../tokens';
import { capitalize } from '../utils';

export default function generateFormFields(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/FormFields.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FieldSelectProps, FieldInputProps } from '@ev3/ui/dist/types'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@ev3/ui/dist/types',
    namedImports: schema.columns
    .filter(column => !!fields[column.field.method])
    .map(column => `${fields[column.field.method]}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  //import Control from '@ev3/ui/dist/tailwind/Control';
  source.addImportDeclaration({
    defaultImport: 'Control',
    moduleSpecifier: '@ev3/ui/dist/tailwind/Control'
  });
  schema.columns
    .filter(column => !!fields[column.field.method])
    .map(column => fields[column.field.method])
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((defaultImport) => {
      //import Control from '@ev3/ui/dist/tailwind/Control';
      source.addImportDeclaration({ 
        defaultImport, 
        moduleSpecifier: `@ev3/ui/dist/${ui}/${defaultImport}` 
      });
    });
  //export type FormComponentProps
  source.addTypeAlias({
    isExported: true,
    name: 'FormComponentProps',
    type: `Record<string, any> & {
      label?: string,
      error?: string,
      change: (paths: string|string[], value: any) => void
    }`
  });
  //export NameField: (props: FormComponentProps) => React.ReactElement
  schema.columns.filter(
    (column) => !!fields[column.field.method]
  ).forEach((column) => {
    source.addFunction({
      isExported: true,
      name: `${capitalize(column.name)}Field`,
      parameters: [
        { name: 'props', type: 'FormComponentProps' }
      ],
      returnType: 'React.ReactElement',
      statements: (`
        const { label, error, change, ...fieldProps } = props;
        const attributes: ${fields[column.field.method]}Props = Object.assign(
          ${JSON.stringify(column.field.attributes || {}, null, 2)},
          fieldProps || {}
        );
        attributes.error = Boolean(error);
        attributes.onUpdate = value => change('${column.name}', value);
        return React.createElement(
          Control,
          { label, error },
          React.createElement(
            ${fields[column.field.method]},
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
        name: 'FormFields',
        initializer: `{
          ${schema.columns
            .filter((column) => !!fields[column.field.method])
            .map((column) => `${capitalize(column.name)}Field`)
            .join(',\n')}
        }`,
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'FormFields'
  });
};
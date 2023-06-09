//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { VariableDeclarationKind } from 'ts-morph';
import { fields } from 'frui/data/tokens';
import { capitalize, formatCode } from '../../utils';

export default function generateFormFields(
  project: Project|Directory, 
  schema: SchemaConfig,
  ui = 'react'
) {
  const path = `${schema.name}/components/FormFields.tsx`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { FieldSelectProps, FieldInputProps } from 'frui'
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'frui',
    namedImports: schema.columns
    .filter(column => !!fields[column.field.method])
    .map(column => `${fields[column.field.method].component}Props`)
    .filter((value, index, array) => array.indexOf(value) === index)
  });
  //import React from 'react';
  source.addImportDeclaration({
    defaultImport: 'React',
    moduleSpecifier: 'react'
  });
  //import Control from 'frui/tailwind/Control';
  source.addImportDeclaration({
    defaultImport: 'Control',
    moduleSpecifier: `frui/${ui}/Control`
  });
  schema.columns
    .filter(column => !!fields[column.field.method])
    .map(column => fields[column.field.method].component)
    .filter((value, index, array) => array.indexOf(value) === index)
    .forEach((defaultImport) => {
      //import FieldInput from 'frui/tailwind/FieldInput';
      source.addImportDeclaration({ 
        defaultImport, 
        moduleSpecifier: `frui/${ui}/${defaultImport}` 
      });
    });
  //export type FormComponentProps
  source.addTypeAlias({
    isExported: true,
    name: 'FormComponentProps',
    type: formatCode(`Record<string, any> & {
      label?: string,
      error?: string,
      change: (paths: string|string[], value: any) => void
    }`)
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
      statements: formatCode(`
        const { label, error, change, ...fieldProps } = props;
        const attributes: ${fields[column.field.method].component}Props = Object.assign(
          ${JSON.stringify(column.field.attributes || {}, null, 2)},
          fieldProps || {}
        );
        attributes.error = Boolean(error);
        attributes.onUpdate = value => change('${column.name}', value);
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
        name: 'FormFields',
        initializer: formatCode(`{
          ${schema.columns
            .filter((column) => !!fields[column.field.method])
            .map((column) => `${capitalize(column.name)}Field`)
            .join(',\n')}
        }`),
    }]
  });
  source.addExportAssignment({
    isExportEquals: false,
    expression: 'FormFields'
  });
};
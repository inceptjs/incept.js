//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '@inceptjs/client/dist/types';
//helpers
import { getTypeName } from './utils';

export default function generateValidate(
  project: Project|Directory, 
  schema: SchemaConfig
) {
  const path = `${schema.name}/validate.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { ModelType } from '../types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: './types',
    namedImports: [ getTypeName(schema) ]
  });
  //import validators from '@ev3/client/dist/validators'
  source.addImportDeclaration({
    defaultImport: 'validators',
    moduleSpecifier: '@ev3/client/dist/validators'
  });
  //export default function validate(data: Partial<ModelType>)
  source.addFunction({
    isDefaultExport: true,
    name: 'validate',
    parameters: [
      { name: 'data', type: `Partial<${getTypeName(schema)}>` },
      { name: 'strict', initializer: 'true' }
    ],
    statements: (`
      const errors: Record<string, string> = {};
      ${schema.columns.map(column => column.validation.map(validation => {
        const required = validation.method === 'required';
        const method = `validators.${validation.method}`;
        const parameters = [ 
          `data.${column.name}`,
          ...validation.parameters.map(arg => JSON.stringify(arg))
        ];
        return (`
          if (${required ? 'strict && ': ''}!${method}(${parameters.join(', ')})) {
            errors.${column.name} = '${validation.message}';
          }
        `)
      }).join(' else ')).join('\n')}
      return errors;
    `)
  });
};
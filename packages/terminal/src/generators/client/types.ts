//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs';
//helpers
import { 
  capitalize, 
  isRequired, 
  getTypeName, 
  getTypeExtendedName,
  formatCode
} from '../utils';

export default function generateModelTypes(
  project: Project|Directory, 
  schema: SchemaConfig,
  join: Record<string, SchemaConfig> = {}
) {
  const typeName = getTypeName(schema);
  const typeExtendedName = getTypeExtendedName(schema);
  const path = `${schema.name}/types.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse } from 'inceptjs';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'inceptjs',
    namedImports: [ 'APIResponse' ]
  });

  Object.values(schema.relations || {}).filter(
    relation => !!join[relation.schema]
  ).forEach(relation => {
    //import type { Model2TypeExtended } from '../model2/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `../${relation.schema}/types`,
      namedImports: [ getTypeExtendedName(join[relation.schema]) ]
    });
  });
  //export type ModelType
  source.addTypeAlias({
    isExported: true,
    name: typeName,
    type: formatCode(`{
      ${schema.columns.map(column => (
        `${column.name}${!isRequired(column) ? '?' : ''}: ${column.type}`
      )).join(',\n')}
    }`)
  });
  if (typeName !== typeExtendedName) {
    //export type ModelTypeExtended
    source.addTypeAlias({
      isExported: true,
      name: typeExtendedName,
      type: formatCode(`${typeName} & {
        ${Object.values(schema.relations || {}).filter(
          relation => !!join[relation.schema]
        ).map(relation => {
          const column = schema.columns.filter(column => column.name === relation.from)[0];
          const optional = !column || !column.data.required;
          return `${relation.schema}${optional ? '?' : ''}: ${getTypeExtendedName(join[relation.schema])}`
        }).join(',\n')}
      }`)
    });
  }
  
  //export type ModelFormResponse = APIResponse<ModelType>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}FormResponse`,
    type: `APIResponse<${getTypeName(schema)}>`
  });
  //export type ModelDetailResponse = APIResponse<ModelTypeExtended>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}DetailResponse`,
    type: `APIResponse<${getTypeExtendedName(schema)}>`
  });
  //export type ModelSearchResponse = APIResponse<ModelTypeExtended[]>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}SearchResponse`,
    type: `APIResponse<${getTypeExtendedName(schema)}[]>`
  });
};
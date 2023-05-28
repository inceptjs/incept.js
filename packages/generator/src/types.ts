//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from '../../types';
//helpers
import { 
  capitalize, 
  isRequired, 
  getTypeName, 
  getTypeExtendedName 
} from '../../utils';

export default function generateModelTypes(
  project: Project|Directory, 
  schema: SchemaConfig,
  join: Record<string, SchemaConfig> = {}
) {
  const typeName = getTypeName(schema);
  const typeExtendedName = getTypeExtendedName(schema);
  const path = `${schema.name}/types.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  //import type { APIResponse } from '@ev3/client/dist/types';
  source.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@ev3/client/dist/types',
    namedImports: [ 'APIResponse' ]
  });
  schema.relations.filter(
    relation => !!join[relation.name]
  ).forEach(relation => {
    //import type { Model2TypeExtended } from '../model2/types';
    source.addImportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `../${relation.name}/types`,
      namedImports: [ getTypeExtendedName(join[relation.name]) ]
    });
  });
  //export type ModelType
  source.addTypeAlias({
    isExported: true,
    name: typeName,
    type: `{
      ${schema.columns.map(column => (
        `${column.name}${!isRequired(column) ? '?' : ''}: ${column.type}`
      )).join(',\n')}
    }`
  });
  if (typeName !== typeExtendedName) {
    //export type ModelTypeExtended
    source.addTypeAlias({
      isExported: true,
      name: typeExtendedName,
      type: `${typeName} & {
        ${schema.relations.filter(
          relation => !!join[relation.name]
        ).map(relation => (
          `${relation.name}${relation.type !== 1 ? '?' : ''}: ${getTypeExtendedName(join[relation.name])}`
        )).join(',\n')}
      }`
    });
  }
  
  //export type ModelFormResponse = APIResponse<ModelType>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}FormResponse`,
    type: `APIResponse<${getTypeName(schema)}>`
  });
  //export type ModelViewResponse = APIResponse<ModelTypeExtended>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}ViewResponse`,
    type: `APIResponse<${getTypeExtendedName(schema)}>`
  });
  //export type ModelRowsResponse = APIResponse<ModelTypeExtended[]>
  source.addTypeAlias({
    isExported: true,
    name: `${capitalize(schema.name)}RowsResponse`,
    type: `APIResponse<${getTypeExtendedName(schema)}[]>`
  });
};
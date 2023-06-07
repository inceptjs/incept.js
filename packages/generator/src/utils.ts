import type { SchemaConfig, SchemaColumn } from 'inceptjs/server';

export function getTypeName(schema: SchemaConfig) {
  return `${capitalize(schema.name)}Type`;
};

export function getTypeExtendedName(schema: SchemaConfig) {
  return schema.relations.length 
    ? `${capitalize(schema.name)}TypeExtended`
    : `${capitalize(schema.name)}Type`;
};

export function isRequired(field: SchemaColumn) {
  if (field.data.required) {
    return true;
  }
  for (const validation of field.validation) {
    if (validation.method === 'required') {
      return true;
    }
  }
  return false;
};

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
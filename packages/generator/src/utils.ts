import type { SchemaConfig, SchemaColumn } from '@inceptjs/client/dist/types';

//helpers
import fs from 'fs';
import path from 'path';

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

export function getConfig(cwd: string) {
  //look in ev3.config.js for the schema files
  if (fs.existsSync(path.join(cwd, 'ev3.config.js'))
    || fs.existsSync(path.join(cwd, 'ev3.config.json'))
  ) {
    return require(path.join(cwd, 'ev3.config')) || {};
  //look in package.json for the schema files
  } else if (fs.existsSync(path.join(cwd, 'package.json'))) {
    return require(path.join(cwd, 'package.json')).ev3 || {};
  }

  return {};
};

export function findNodeModules(cwd: string): string {
  if (cwd === '/') {
    throw new Error('Could not find node_modules');
  }
  if (fs.existsSync(path.resolve(cwd, 'node_modules/@ev3/client'))) {
    return path.resolve(cwd, 'node_modules');
  }
  return findNodeModules(path.dirname(cwd));
};

export function getSchemaFolder(cwd: string) {
  const config = getConfig(cwd);
  const folder = config.schemas as string || './schema';
  if (folder.indexOf('./') === 0) {
    return path.join(cwd, folder.replace('./', '')); 
  } else if (folder.indexOf('../') === 0) {
    return path.join(path.dirname(cwd), folder.replace('../', '')); 
  }
  return folder;
}
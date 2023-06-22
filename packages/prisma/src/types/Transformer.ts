import type { SchemaConfig, SchemaColumn } from 'inceptjs';

import { EOL } from 'os';
import { Schema } from 'inceptjs';

export default class ModelTransformer {
  //retainer for the schema instance
  protected _schema: Schema;

  /**
   * Compiles the header of a prisma schema
   */
  public static getHeader(provider: string, url: string) {
    return header.replace('%s', provider).replace('%s', url).trim();
  }

  /**
   * Returns all the model transformations
   */
  public static getModels() {
    return Object.values(Schema.configs).map(config => {
      const model = new ModelTransformer(config);
      return model.getModel();
    });
  }

  /**
   * Transforms all schema jsons to a prisma schema
   */
  public static transform(provider: string, url: string) {
    return [ 
      this.getHeader(provider, url), 
      ...this.getModels() 
    ].join(EOL+EOL);
  }

  /**
   * Just create and store the selected schema
   */
  constructor(config: SchemaConfig) {
    this._schema = new Schema(config);
  }

  /**
   * Remaps the default value to a prisma default
   */
  public getDefault(column: SchemaColumn) {
    return typeof column.default === 'string' 
      ? (methods[column.default] 
        ? methods[column.default] 
        : `"${column.default}"`
      ) : column.default;
  }

  /**
   * Determines if a column is an id
   */
  public getID(column: SchemaColumn) {
    return column.data.primary ? '@id' : false;
  }

  /**
   * Determines if a column should be mapped
   */
  public getMap(column: SchemaColumn) {
    return column.name.includes('_') ? `@map("${column.name}")` : false;
  } 

  /**
   * Transforms a schema to a prisma model
   */
  public getModel() {
    const name = this.getModelName();
    const props = this.getProperties();
    const relations = this.getRelations();

    return [
      `model ${name} {`,
      ...props.map(prop => `  ${prop}`),
      ...relations.map(relation => `  ${relation}`),
      '}'
    ].join(EOL);
  }

  /**
   * Returns a formatted prisma model name
   */
  public getModelName(name?: string) {
    name = name || this._schema.name;
    return camelfy(name, false);
  }

  /**
   * Returns all the property transformations
   */
  public getProperties() {
    const props: string[] = [];
    for (const column of this._schema.columns) {
      props.push([
        camelfy(column.name),
        this.getType(column),
        this.getID(column),
        this.getUnique(column),
        this.getDefault(column),
        this.getMap(column)
      ].filter(Boolean).join(' '));
    }
    return props;
  }

  /**
   * Returns all the relation transformations
   */
  public getRelations() {
    const relations: string[] = [];

    for (const name in this._schema.relatedFields) {
      const column = this._schema.relatedFields[name];
      //if required
      const required = column.data.required ? '' : '?';
      //if unique
      const unique = column.data.unique ? '' : '[]';
      relations.push([
        camelfy(name),
        this.getModelName(name) + (required || unique),
      ].join(' '));
    }
    
    for (const column of this._schema.relationFields) {
      if (typeof column.relation === 'object') {
        relations.push([
          camelfy(column.relation.schema),
          this.getModelName(column.relation.schema),
          `@relation(fields: [${camelfy(column.name)}],`,
          `references: [${camelfy(column.relation.column)}])`
        ].join(' '));
      }
    } 
    
    return relations;
  }

  /**
   * Transforms a column type to a prisma type
   */
  public getType(column: SchemaColumn) {
    let type = 'String';
    switch (column.data.type) {
      case 'varchar':
      case 'char':
      case 'text':
        type = 'String';
        break;
      case 'date':
      case 'datetime':
      case 'time':
        type = 'DateTime';
        break;
      case 'int':
        type = 'Int';
        break;
      case 'float':
        type = 'Float';
        break;
      case 'boolean':
        type = 'Boolean';
        break;
      case 'json':
        type = column.type === 'string[]' 
          ? 'string[]' 
          : 'Json';
        break;
    }

    return !column.data.primary && !column.data.required ? `${type}?` : type;
  }

  /**
   * Determines if a column is unique
   */
  public getUnique(column: SchemaColumn) {
    return column.data.unique && !column.data.primary ? '@unique' : false;
  } 
};

function camelfy(str: string, lower = true) {
  const camel = str.trim()
    //replace special characters with underscores
    .replace(/[^a-zA-Z0-9]/g, '_')
    //replace multiple underscores with a single underscore
    .replace(/_{2,}/g, '_')
    //trim underscores from the beginning and end of the string
    .replace(/^_+|_+$/g, '')
    //replace underscores with capital
    .replace(/([-_][a-z0-9])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  if (lower) {
    //return lowercase first char
    return camel.charAt(0).toLowerCase() + camel.slice(1);
  }

  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const methods: Record<string, string> = {
  'now()': '@default(now())',
  'updated()': '@updatedAt',
  'nanoid()': '@default(cuid())',
  'cuid()': '@default(cuid())',
  'cuid2()': '@default(cuid())',
  'increment()': '@default(autoincrement())'
};

const header = `
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}
datasource db {
  provider = "%s"
  url      = env("%s")
}`;
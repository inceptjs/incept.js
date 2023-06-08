import type { SchemaConfig, SchemaRelation } from '../types';

import Exception from './Exception';
import validators from '../validators';

export default class Schema<Model = any> {
  /**
   * A cached list of all schemas
   */
  protected static _schemas: Record<string, SchemaConfig> = {};

  /**
   * Adds a schema to the cache
   */
  public static add(schema: SchemaConfig|SchemaConfig[]) {
    if (Array.isArray(schema)) {
      schema.forEach(schema => this.add(schema));
      return;
    }
    this._schemas[schema.name] = schema;
  }

  /**
   * Gets a schema from the cache
   */
  public static get(name: string) {
    return this._schemas[name];
  }

  /**
   * Gets all routes from all schemas
   */
  public static get routes() {
    return Object
      .values(this._schemas)
      .map(schema => Object.values(schema.rest))
      .flat(1);
  }

  /**
   * The schema config
   */
  protected _schema: SchemaConfig;

  /**
   * Returns all the columns
   */
  get columns() {
    return this._schema.columns;
  }

  /**
   * Returns the schema config
   */
  get config() {
    return this._schema;
  }

  /**
   * Returns the schema description
   */
  get description() {
    return this._schema.description;
  }

  /**
   * Returns the filterable columns
   */
  get filterable() {
    return this._schema.columns.filter(column => column.filterable);
  }

  /**
   * Returns the schema group
   */
  get group() {
    return this._schema.group;
  }

  /**
   * Returns the schema icon
   */
  get icon() {
    return this._schema.icon;
  }

  /**
   * Returns the indexed columns
   */
  get index() {
    return this._schema.columns.filter(
      column => column.searchable 
        || column.filterable 
        || column.sortable
    );
  }

  /**
   * Returns the schema name
   */
  get name() {
    return this._schema.name;
  }

  /**
   * Returns the schema plural label
   */
  get plural() {
    return this._schema.plural;
  }

  /**
   * Returns the primary columns
   */
  get primary() {
    return this._schema.columns.filter(column => column.data.primary);
  }

  /**
   * Returns the all the schema relations
   */
  get relations() {
    const relations: Record<string, SchemaRelation> = {};
    this._schema.relations.forEach(relation => {
      relations[relation.schema] = relation;
    });

    return relations;
  }

  /**
   * Returns the schema rest routes
   */
  get routes() {
    return Object.values(this._schema.rest);
  }

  /**
   * Returns the searchable columns
   */
  get searchable() {
    return this._schema.columns.filter(column => column.searchable);
  }

  /**
   * Returns the schema singular label
   */
  get singular() {
    return this._schema.singular;
  }

  /**
   * Returns the sortable columns
   */
  get sortable() {
    return this._schema.columns.filter(column => column.sortable);
  }

  /**
   * Returns the unique columns
   */
  get unique() {
    return this._schema.columns.filter(column => column.data.unique);
  }

  /**
   * Just load the schema
   */
  constructor(schema: string|SchemaConfig) {
    if (typeof schema === 'string') {
      const config = Schema.get(schema);
      if (!config) {
        throw Exception.for(`Schema "${schema}" not found`);
      }
      schema = config;
    }
    this._schema = schema;
  }

  /**
   * Returns a column given the name
   */
  column(name: string) {
    return this._schema.columns.find(column => column.name === name);
  }

  /**
   * Validates data and returns errors
   */
  errors(data: Record<string, any>, strict = false): Record<string, any> {
    const errors: Record<string, any> = {};
    this._schema.columns.forEach(column => {
      column.validation.forEach(validator => {
        if (!strict && validator.method === 'required') {
          return;
        }
        if (!errors[column.name]) {
          const method = validators[validator.method] as Function;
          if (!method(data[column.name], ...validator.parameters)) {
            errors[column.name] = validator.message;
          }
        }
      });
    });
    return errors;
  }

  /**
   * Filters out data that is not in the schema
   */
  prepare(data: Record<string, any>): Model {
    const prepared: Record<string, any> = {};
    this._schema.columns.forEach(column => {
      if (data[column.name] !== undefined) {
        prepared[column.name] = data[column.name];
      }
    });
    return prepared as Model;
  }

  /**
   * Returns a relation schema given the name
   */
  relation(name: string): SchemaRelation|undefined {
    return this._schema.relations.filter(
      relation => relation.name === name
    )[0];
  }
}
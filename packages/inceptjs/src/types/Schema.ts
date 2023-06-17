import type { SchemaConfig, SchemaRelation } from '../types';

import Exception from './Exception';
import validators from '../validators';

export default class Schema<Model = any> {
  /**
   * A cached list of all schemas
   */
  protected static _configs: Record<string, SchemaConfig> = {};

  /**
   * Returns all the schemas
   */
  public static get schemas() {
    return this._configs;
  }

  /**
   * Adds a schema to the cache
   */
  public static add(schema: SchemaConfig|SchemaConfig[]) {
    if (Array.isArray(schema)) {
      schema.forEach(schema => this.add(schema));
      return;
    }
    this._configs[schema.name] = schema;
  }

  /**
   * Gets a schema from the cache
   */
  public static get(name: string) {
    return this._configs[name];
  }

  /**
   * Gets all routes from all schemas
   */
  public static get routes() {
    return Object
      .values(this._configs)
      .map(schema => Object.values(schema.rest))
      .flat(1);
  }

  /**
   * The schema config
   */
  protected _config: SchemaConfig;

  /**
   * Returns all the columns
   */
  get columns() {
    return this._config.columns;
  }

  /**
   * Returns the schema config
   */
  get config() {
    return this._config;
  }

  /**
   * Returns the schema description
   */
  get description() {
    return this._config.description;
  }

  /**
   * Returns the filterable columns
   */
  get filterable() {
    return this._config.columns.filter(column => column.filterable);
  }

  /**
   * Returns the schema group
   */
  get group() {
    return this._config.group;
  }

  /**
   * Returns the schema icon
   */
  get icon() {
    return this._config.icon;
  }

  /**
   * Returns the indexed columns
   */
  get index() {
    return this._config.columns.filter(
      column => column.searchable 
        || column.filterable 
        || column.sortable
    );
  }

  /**
   * Returns the schema name
   */
  get name() {
    return this._config.name;
  }

  /**
   * Returns the schema plural label
   */
  get plural() {
    return this._config.plural;
  }

  /**
   * Returns the primary columns
   */
  get primary() {
    return this._config.columns.filter(column => column.data.primary);
  }

  /**
   * Returns the all the schema relations related to this schema
   */
  get related() {
    const related: Record<string, SchemaRelation> = {};
    Object.keys(Schema.schemas).forEach(name => {
      const schema = Schema.schemas[name];
      schema.relations.forEach(relation => {
        if (relation.schema === this.name) {
          related[name] = relation;
        }
      });
    });

    return related;
  }

  /**
   * Returns the all the schema relations
   */
  get relations() {
    const relations: Record<string, SchemaRelation> = {};
    this._config.relations.forEach(relation => {
      relations[relation.schema] = relation;
    });

    return relations;
  }

  /**
   * Returns the schema rest routes
   */
  get routes() {
    return Object.values(this._config.rest);
  }

  /**
   * Returns the searchable columns
   */
  get searchable() {
    return this._config.columns.filter(column => column.searchable);
  }

  /**
   * Returns the schema singular label
   */
  get singular() {
    return this._config.singular;
  }

  /**
   * Returns the sortable columns
   */
  get sortable() {
    return this._config.columns.filter(column => column.sortable);
  }

  /**
   * Returns the unique columns
   */
  get unique() {
    return this._config.columns.filter(column => column.data.unique);
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
    this._config = schema;
  }

  /**
   * Returns a column given the name
   */
  column(name: string) {
    return this._config.columns.find(column => column.name === name);
  }

  /**
   * Validates data and returns errors
   */
  errors(data: Record<string, any>, strict = true): Record<string, any> {
    const errors: Record<string, any> = {};
    this._config.columns.forEach(column => {
      column.validation.forEach(validator => {
        if (!strict && validator.method === 'required') {
          return;
        }
        //if unique, (this needs to be handled by the database)
        if (validator.method === 'unique') {
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
    this._config.columns.forEach(column => {
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
    return this._config.relations.filter(
      relation => relation.name === name
    )[0];
  }
}
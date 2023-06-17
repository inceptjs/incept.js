import type { FieldsetConfig } from '../types';

import Exception from './Exception';
import validators from '../validators';

export default class Fieldset<Model = any> {
  /**
   * A cached list of all schemas
   */
  protected static _configs: Record<string, FieldsetConfig> = {};

  /**
   * Returns all the configs
   */
  public static get configs() {
    return this._configs;
  }

  /**
   * Adds a config to the cache
   */
  public static add(config: FieldsetConfig|FieldsetConfig[]) {
    if (Array.isArray(config)) {
      config.forEach(config => this.add(config));
      return;
    }
    this._configs[config.name] = config;
  }

  /**
   * Gets a config from the cache
   */
  public static get(name: string) {
    return this._configs[name];
  }

  /**
   * The schema config
   */
  protected _config: FieldsetConfig;

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
   * Returns the schema icon
   */
  get icon() {
    return this._config.icon;
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
   * Returns the schema singular label
   */
  get singular() {
    return this._config.singular;
  }

  /**
   * Just load the config
   */
  constructor(config: string|FieldsetConfig) {
    if (typeof config === 'string') {
      config = (this.constructor as typeof Fieldset).get(config);
      if (!config) {
        throw Exception.for(`Config "${config}" not found`);
      }
    }
    this._config = config;
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
}
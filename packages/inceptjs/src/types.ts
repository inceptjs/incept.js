import type { IncomingMessage, ServerResponse } from 'http';
import type { Exception, EventEmitter, EventAction } from '@inceptjs/types';

import type Request from './types/Request';
import type Response from './types/Response';

import { FormEvent } from 'react';

//generic types
export type ExtendsType<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
export interface NestedObject<T = any> {
  [key: string]: T|NestedObject<T>;
};
export type ScalarType = string|number|boolean|null;
export type NestedScalarObject = NestedObject<ScalarType>;
export type ScalarInputs = ScalarType|ScalarType[]|NestedScalarObject;

//project
export type ProjectConfig = Record<string, any> & { 
  cwd: string,
  schema: {
    build: string,
    casing: string, //'snake'|'camel',
    prefix: string //'[table]'|'custom' //(wo snake)
  },
  fieldset: {
    build: string
  },
  plugins: string[]
};

//server
export type { IncomingMessage, ServerResponse };
export type ExpressLikeMessage = IncomingMessage & {
  body?: NestedScalarObject|string
};
export type RouteArgs = [ Request, Response<APIResponse>, Exception? ];
export type RouteEmitter = EventEmitter<RouteArgs>;
export type RouteAction = EventAction<RouteArgs>;
export type RouteParams = {
  args: string[];
  params: NestedScalarObject;
};
export type Cookie = { 
  value: string,  
  options: {
    domain?: string,
    expires?: Date,
    httpOnly?: boolean,
    maxAge?: number,
    path?: string,
    sameSite?: boolean|'lax'|'strict'|'none',
    secure?: boolean
  }
}
export type HTTPMethod = 'all'
  | 'connect' | 'delete'  | 'head'
  | 'get'     | 'options' | 'post'
  | 'put'     | 'patch'   | 'trace';

//api and fetch types
export type APIResponse<T = any> = {
  error: boolean,
  code?: number,
  message?: string, 
  errors?: Record<string, any>,
  results?: T,
  total?: number
};
export type APIFetchCall<T = any> = (
  options: FetchCallConfig
) => Promise<APIResponse<T>>;
export type FetchStatuses = 'pending'|'fetching'|'complete';
export type FetchRouteParams = {
  args: (string|number)[],
  params: Record<string, string|number>
};
export type FetchCallConfig = {
  args?: (string|number)[],
  params?: Record<string, string|number>
  query?: Record<string, string|number>,
  data?: Record<string, any>
}

//handlers
export type FilterHandlers = {
  send: (e: FormEvent) => boolean,
  filter: (terms: Record<string, any> | boolean) => void,
  sort: (name: string) => void,
  remove: (remove: string[]) => void,
  reset: (query?: Record<string, any>) => void
};
export type FormChangeHandler = (
  paths: null|true|string|number|(string|number)[], 
  value: any
) => void;
export type FormHandlers = {
  send: (e: FormEvent) => boolean,
  change: FormChangeHandler
};

//schema methods
export type FieldMethod = 'active' 
  | 'autocomplete' | 'checkbox'  | 'checklist' 
  | 'code'         | 'color'     | 'country' 
  | 'created'      | 'currency'  | 'date'
  | 'datetime'     | 'email'     | 'fieldset'
  | 'file'         | 'filelist'  | 'image'
  | 'imagelist'    | 'input'     | 'integer'
  | 'json'         | 'mask'      | 'metadata'
  | 'none'         | 'number'    | 'password'
  | 'phone'        | 'price'     | 'radio'        
  | 'radiolist'    | 'range'     | 'rating'
  | 'select'       | 'slider'    | 'slug'
  | 'small'        | 'switch'    | 'table'
  | 'taglist'      | 'text'      | 'textarea'
  | 'textlist'     | 'time'      | 'updated'
  | 'url'          | 'wysiwyg';
export type ValidatorMethod = 'eq'
  | 'ne'     | 'notempty' | 'option'
  | 'unique' | 'required' | 'regex'
  | 'date'   | 'datetime' | 'time'
  | 'future' | 'past'     | 'present'
  | 'gt'     | 'ge'       | 'lt'
  | 'le'     | 'float'    | 'integer'
  | 'number' | 'price'    | 'ceq'
  | 'cgt'    | 'cge'      | 'clt'
  | 'cle'    | 'wgt'      | 'wge'
  | 'wlt'    | 'wle'      | 'cc'
  | 'email'  | 'hex'      | 'color'
  | 'url';
export type FormatMethod = 'captal' 
  | 'char'     | 'color'    | 'comma'
  | 'country'  | 'currency' | 'date' 
  | 'carousel' | 'email'    | 'escaped'  
  | 'formula'  | 'hide'     | 'html'     
  | 'image'    | 'json'     | 'line'  
  | 'link'     | 'list'     | 'lower'
  | 'markdown' | 'metadata' | 'none'
  | 'number'   | 'ol'       | 'pretty' 
  | 'price'    | 'phone'    | 'rating'  
  | 'rel'      | 'relative' | 'space' 
  | 'table'    | 'taglist'  | 'text'  
  | 'ul'       | 'upper'    | 'word' 
  | 'yesno';

//column options
export type ColumnFieldOption = { 
  method: string,
  label: string,
  component: string|false, 
  attributes: OptionShowDefault<Record<string, any>> & {
    fixed: Record<string, any>
  }, 
  params: {
    field: string,
    attribute: string,
    attributes: Record<string, any>
  }[],
  default: OptionShowDefaultOptional<string|number>,
  validation: { show: boolean, filter: string[] },
  column: {
    type: string,
    name: OptionShowDefaultOptional<string>,
    label: OptionShowDefaultOptional<string>
  },
  data: {
    type: OptionShowDefaultOptional<string>,
    length: OptionShowDefaultOptional<number|[number, number]>,
    primary: OptionShowDefault<boolean>,
    required: OptionShowDefault<boolean>,
    unique: OptionShowDefault<boolean>,
    unsigned: OptionShowDefault<boolean>,
    relation: { show: boolean }
  },
  display: {
    list: OptionShowDefaultOptional<string> & { filter: string[] },
    view: OptionShowDefaultOptional<string> & { filter: string[] },
    searchable: OptionShowDefault<boolean>,
    filterable: OptionShowDefault<boolean>,
    sortable: OptionShowDefault<boolean>
  },
  enabled: boolean
};
export type ColumnValidationOption = { 
  method: string,
  label: string,
  params: {
    field: string,
    attributes?: Record<string, any>
  }[],
  enabled: boolean
};
export type ColumnFormatOption = { 
  method: string,
  label: string,
  component: string|false, 
  attributes: {
    show: boolean,
    fixed: Record<string, any>,
    default: Record<string, any>
  },  
  params: {
    field: string,
    attribute: string,
    attributes: Record<string, any>
  }[],
  enabled: boolean
};

//schema helpers
export type OptionShowDefault<T> = { show: boolean, default: T };
export type OptionShowDefaultOptional<T> = { show: boolean, default?: T };
export type Validation = {
  method: ValidatorMethod,
  parameters: any[],
  message: string
};

//fieldset
export type FieldsetColumnField = {
  method: FieldMethod,
  attributes: Record<string, any>
};
export type FieldsetColumnValidation = Validation[];
export type FieldsetColumnFormat = {
  sticky?: boolean,
  method: FormatMethod,
  attributes: Record<string, any>
};
export type FieldsetColumn = {
  label: string,
  name: string,
  type: string,
  field: FieldsetColumnField,
  validation: FieldsetColumnValidation,
  list: FieldsetColumnFormat,
  view: FieldsetColumnFormat,
  default?: any
};
export type FieldsetConfig = {
  name: string,
  singular: string,
  plural: string,
  icon: string,
  columns: FieldsetColumn[]
};

//schema
export type SchemaColumnData = {
  type: string,
  length?: number|number[],
  required: boolean,
  unique: boolean,
  unsigned: boolean,
  primary: boolean
};
export type SchemaColumnField = FieldsetColumnField;
export type SchemaColumnValidation = Validation[];
export type SchemaColumnFormat = FieldsetColumnFormat;
export type SchemaColumnRelation = {
  label: string,
  schema: string,
  column: string
};
export type SchemaColumn = FieldsetColumn & {
  data: SchemaColumnData,
  default?: any,
  searchable: boolean,
  filterable: boolean,
  sortable: boolean,
  relation?: SchemaColumnRelation
};
export type SchemaRelation = {
  label: string,
  schema: string,
  from: string,
  to: string,
  type: '0:1'|'1:1'|'1:N'|'N:N'
};
export type SchemaRest = {
  type: string,
  method: string,
  path: string,
  event: string,
  body: Record<string, any>
};
export type SchemaConfig = ExtendsType <FieldsetConfig, {
  description: string,
  group: string,
  columns: SchemaColumn[],
  relations: Record<string, SchemaRelation>,
  rest: Record<string, SchemaRest>
}>;
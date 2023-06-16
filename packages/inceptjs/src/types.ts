import type { IncomingMessage, ServerResponse } from 'http';
import type { Exception, EventEmitter, EventAction } from '@inceptjs/types';

import type Request from './types/Request';
import type Response from './types/Response';

import { FormEvent } from 'react';

//general
export type ExtendsType<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export interface NestedObject<T = any> {
  [key: string]: T|NestedObject<T>;
};

export type ScalarType = string|number|boolean|null;
export type NestedScalarObject = NestedObject<ScalarType>;
export type ScalarInputs = ScalarType|ScalarType[]|NestedScalarObject;

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

//client
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

//server
export type { IncomingMessage, ServerResponse };
export type ExpressLikeMessage = IncomingMessage & {
  body?: NestedScalarObject|string
};

export type RouterConfig = Record<string, any> & { 
  cwd?: string,
  schemas?: string,
  fieldsets?: string 
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

export type Method = 'all'
  | 'connect'
  | 'delete'
  | 'head'
  | 'get'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'
  | 'trace';

export type FieldMethod = 'autocomplete'
  | 'checkbox'
  | 'checklist'
  | 'code'
  | 'color'
  | 'country'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'fieldset'
  | 'file'
  | 'filelist'
  | 'image'
  | 'imagelist'
  | 'input'
  | 'json'
  | 'mask'
  | 'metadata'
  | 'none'
  | 'number'
  | 'password'
  | 'radio'
  | 'radiolist'
  | 'range'
  | 'select'
  | 'slider'
  | 'switch'
  | 'taglist'
  | 'textarea'
  | 'textlist'
  | 'time';

export type ValidatorMethod = 'ne'
  | 'notempty'
  | 'option'
  | 'required'
  | 'regex'
  | 'date'
  | 'datetime'
  | 'time'
  | 'future'
  | 'past'
  | 'present'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'float'
  | 'integer'
  | 'number'
  | 'price'
  | 'cgt'
  | 'cgte'
  | 'clt'
  | 'clte'
  | 'wgt'
  | 'wgte'
  | 'wlt'
  | 'wlte'
  | 'cc'
  | 'email'
  | 'hex'
  | 'color'
  | 'url';

export type FormatMethod = 'color'
  | 'country'
  | 'currency'
  | 'date'
  | 'email'
  | 'formula'
  | 'hide'
  | 'html'
  | 'image'
  | 'imagelist'
  | 'json'
  | 'link'
  | 'list'
  | 'markdown'
  | 'metadata'
  | 'none'
  | 'number'
  | 'overflow'
  | 'phone'
  | 'rating'
  | 'separated'
  | 'table'
  | 'taglist'
  | 'text'
  | 'yesno'

export type SchemaOption = {
  label: string,
  value: string
};

export type SchemaValidation = {
  method: ValidatorMethod,
  parameters: any[],
  message: string
};

export type SchemaColumnField = {
  method: FieldMethod,
  attributes: Record<string, any>
};

export type SchemaColumnValidation = SchemaValidation[]

export type SchemaColumnFormat = {
  method: FormatMethod,
  attributes: Record<string, any>
};

export type SchemaColumn = {
  label: string,
  name: string,
  type: string,
  data: {
    type: string,
    length?: number,
    required: boolean,
    unique: boolean,
    unsigned: boolean,
    primary: boolean
  },
  field: SchemaColumnField,
  validation: SchemaColumnValidation,
  list: SchemaColumnFormat,
  view: SchemaColumnFormat,
  default?: any,
  searchable: boolean,
  filterable: boolean,
  sortable: boolean
};

export type SchemaRelation = {
  name: string,
  schema: string,
  from: string,
  to: string,
  label: string
};

export type SchemaRest = {
  type: string,
  method: string,
  path: string,
  event: string,
  body: Record<string, any>
};

export type SchemaConfig = {
  name: string,
  singular: string,
  plural: string,
  description: string,
  icon: string,
  group: string,
  columns: SchemaColumn[],
  relations: SchemaRelation[],
  rest: Record<string, SchemaRest>
};
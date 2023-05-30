import { FormEvent } from 'react';

export type FetchStatuses = 'pending'|'fetching'|'complete';

export type APIResponse<T = any> = {
  error: boolean,
  code?: number,
  message?: string, 
  errors?: Record<string, any>,
  results?: T,
  total?: number
};

export type FilterHandlers = {
  send: (e: FormEvent) => boolean,
  filter: (terms: Record<string, any> | boolean) => void,
  sort: (name: string) => void,
  remove: (remove: string[]) => void,
  reset: (query?: Record<string, any>) => void
};

export type FormHandlers = {
  send: (e: FormEvent) => boolean,
  change: (paths: string|string[], value: any) => void
};

export type SchemaOption = {
  label: string,
  value: string
};

export type SchemaValidation = {
  method: string,
  parameters: any[],
  message: string
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
    unsigned: boolean
  },
  field: {
    method: string,
    attributes: Record<string, any>
  },
  validation: SchemaValidation[],
  list: {
    sticky: boolean,
    method: string,
    attributes: Record<string, any>
  },
  view: {
    method: string,
    attributes: Record<string, any>
  },
  default?: any,
  searchable: boolean,
  filterable: boolean,
  sortable: boolean
};
export type SchemaRelation = {
  name: string,
  type: number,
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
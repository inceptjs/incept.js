import { FormEvent } from 'react';

export type FetchStatuses = 'pending'|'fetching'|'complete';

//not used
export type FieldMethods = 'checkbox'
  | 'checklist'
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
  | 'inputmask'
  | 'json'
  | 'metadata'
  | 'none'
  | 'number'
  | 'password'
  | 'radio'
  | 'select'
  | 'switch'
  | 'taglist'
  | 'textarea'
  | 'textlist'
  | 'time';
//not used
export type FormatMethods = 'capilaize'
  | 'charcount'
  | 'color'
  | 'comma'
  | 'country'
  | 'currency'
  | 'date'
  | 'email'
  | 'forumla'
  | 'hide'
  | 'html'
  | 'image'
  | 'json'
  | 'line'
  | 'link'
  | 'lowercase'
  | 'markdown'
  | 'metadata'
  | 'none'
  | 'number'
  | 'ol'
  | 'phone'
  | 'price'
  | 'rating'
  | 'relative'
  | 'space'
  | 'table'
  | 'taglist'
  | 'ul'
  | 'uppercase'
  | 'wordcount'
  | 'yesno';

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
    type: string,
    method: string,
    attributes: Record<string, any>
  },
  validation: SchemaValidation[],
  list: {
    type: string,
    sticky: boolean,
    method: string,
    attributes: Record<string, any>
  },
  view: {
    type: string,
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

export type SchemaConfig = {
  name: string,
  singular: string,
  plural: string,
  description: string,
  icon: string,
  group: string,
  columns: SchemaColumn[],
  relations: SchemaRelation[]
};
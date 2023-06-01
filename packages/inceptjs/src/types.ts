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
  field: {
    method: FieldMethod,
    attributes: Record<string, any>
  },
  validation: SchemaValidation[],
  list: {
    sticky: boolean,
    method: FormatMethod,
    attributes: Record<string, any>
  },
  view: {
    method: FormatMethod,
    attributes: Record<string, any>
  },
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
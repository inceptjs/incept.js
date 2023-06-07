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
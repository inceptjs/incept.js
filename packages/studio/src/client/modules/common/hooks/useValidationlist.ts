import type { Validation, ValidatorMethod } from 'inceptjs/api';

import { api } from 'inceptjs/api';

export type FieldValidationlistType = Validation;
export type FieldValidationlistConfig = {
  type?: string,
  values?: (FieldValidationlistType|undefined)[],
  index: number,
  set: (values: (FieldValidationlistType|undefined)[]) => void
};

export default function useValidationlist(config: FieldValidationlistConfig) {
  const { values, index, set, type } = config;
  //variables
  const options = api.validator.groups(
    api.field.get(type || '')?.validation.filter || []
  );
  const selected = api.validator.get(values?.[index]?.method || '');
  //handlers
  const handlers = {
    method: (method: ValidatorMethod) => {
      const clone = [ ...(values || []) ];
      const current = clone[index] as FieldValidationlistType;
      //only if method is different
      if (current.method !== method) {
        clone[index] = { ...current, method };
        set(clone);
      }
    },
    message: (message: string) => {
      const clone = [ ...(values || []) ];
      const current = clone[index] as FieldValidationlistType;
      //only if message is different
      if (current.message !== message) {
        clone[index] = { ...current, message };
        set(clone);
      }
    },
    parameters: (i: number, value: any) => {
      const clone = [ ...(values || []) ];
      const current = clone[index] as FieldValidationlistType;
      const parameters = [...(current.parameters || [])];
      if (JSON.stringify(parameters[i]) !== JSON.stringify(value)) {
        parameters[i] = value;
        clone[index] = { ...current, parameters };
        set(clone);
      }
    },
    remove: () => {
      const newValues = [ ...(values || []) ];
      newValues[index] = undefined;
      set(newValues);
    }
  };
  
  return { selected, options, handlers };
}
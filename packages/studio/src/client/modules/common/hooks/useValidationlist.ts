import type { SchemaValidation, ValidatorMethod } from 'inceptjs';
import type { ValidationOption } from '../column';

import { 
  validators, 
  filterValidators,
  getField
} from '../column';

export type FieldValidationlistType = SchemaValidation;
export type FieldValidationlistConfig = {
  type?: string,
  values?: (FieldValidationlistType|undefined)[],
  index: number,
  set: (values: (FieldValidationlistType|undefined)[]) => void
};

export default function useValidationlist(config: FieldValidationlistConfig) {
  const { values, index, set, type } = config;

  let options = validators;
  if (type) {
    const field = getField(type);
    if (field) {
      options = filterValidators(field.validation.filter)
    }
   
  }

  let selected: ValidationOption|undefined;
  Object.keys(options).forEach(group => {
    Object.keys(options[group]).forEach(option => {
      if (values && option === values[index]?.method) {
        selected = options[group][option];
      }
    });
  });

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
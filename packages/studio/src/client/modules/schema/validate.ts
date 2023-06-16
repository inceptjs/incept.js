import type { SchemaColumn, SchemaConfig } from 'inceptjs';
import { validators } from 'inceptjs';

export function validateColumn(column: Partial<SchemaColumn>) {
  const errors: Record<string, string> = {};
  if (!validators.required(column.name)) {
    errors.name = 'Name is required';
  }
  if (!validators.required(column.label)) {
    errors.label = 'Label is required';
  }

  return errors;
}

export default function validate(data: Partial<SchemaConfig>, strict = true) {
  const errors: Record<string, any> = {};
  if (strict && !validators.required(data.name)) {
    errors.name = 'Name is required';
  }
  if (strict && !validators.required(data.singular)) {
    errors.username = 'Singular is required';
  }
  if (strict && !validators.required(data.plural)) {
    errors.username = 'Plural is required';
  }
  if (!data.columns?.length) {
    errors.columns = 'Must have at least one column';
  } else {
    errors.columns = {} as Record<number, Record<string, string>>;
    data.columns.forEach((column, index) => {
      const error = validateColumn(column);
      if (Object.keys(errors).length) {
        errors.columns[index] = error;
      }
    });
    if (!Object.keys(errors.columns).length) {
      delete errors.columns;
    }
  }
  return errors;
}

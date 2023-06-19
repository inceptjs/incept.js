//types
import type { FieldSelectOption } from 'frui';
export type FieldSchemaState = { 
  label: string, 
  schema: string, 
  column: string 
};
export type FieldSchemaHandler = (value: FieldSchemaState) => void;
export type FieldSchemaOption = FieldSelectOption<string>;

import { useState, useEffect } from 'react';
import { Schema } from 'inceptjs';

export default function useFieldSelectSchema(
  defaultValue?: Partial<FieldSchemaState>,
  onUpdated?: FieldSchemaHandler
) {
  const [ selected, select ] = useState<Partial<FieldSchemaState>>(
    defaultValue || {}
  );

  const schemas: FieldSchemaOption[] = Object
    .values(Schema.configs)
    .map(schema => ({
      label: schema.singular, 
      value: schema.name,
      keyword: schema.name
    }));

  const columns: FieldSchemaOption[] = selected.schema 
    ? new Schema(selected.schema).columns.map(
      column => ({
        label: column.label,
        value: column.name,
        keyword: column.name
      })
    )
    : [];
  
  useEffect(() => {
    if (!selected.label || !selected.schema || !selected.column) {
      return;
    }
    onUpdated && onUpdated({
      label: selected.label,
      schema: selected.schema,
      column: selected.column
    });
  }, [ selected ]);

  
  return { selected, schemas, columns, select };
}
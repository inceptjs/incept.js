//types
import type { FieldSelectOption } from 'frui';
import type { SchemaColumn, SchemaRelation } from 'inceptjs/api';
//helpers
import { Schema } from 'inceptjs';

export type StringOption = FieldSelectOption<string>;

export type FieldRelationlistType = SchemaRelation;
export type FieldRelationlistConfig = {
  columns: SchemaColumn[],
  values?: (FieldRelationlistType|undefined)[],
  index: number,
  set: (values: (FieldRelationlistType|undefined)[]) => void
};

export default function useFieldRelationlist(
  config: FieldRelationlistConfig
) {
  const { columns, values, index, set } = config;

  const selected = values?.[index] || {
    label: '',
    schema: '',
    from: '',
    to: '',
    type: '0:1'
  };

  const schema = Schema.get(selected?.schema as string) 
    ? new Schema(selected?.schema as string)
    : undefined;

  const options = {
    from: columns.map(column => ({
      label: column.label, 
      value: column.name,
      keyword: column.name
    })),
    schemas: Object.values(Schema.configs).map(schema => ({
      label: schema.singular, 
      value: schema.name,
      keyword: schema.name
    })),
    to: schema ? schema.columns.map(
      column => ({
        label: column.label,
        value: column.name,
        keyword: column.name
      })
    ) : []
  };

  //handlers
  const handlers = {
    update: (value: SchemaRelation) => {
      const newValues = [ ...(values || []) ];
      newValues[index] = { ...value };
      set(newValues);
    },
    remove: () => {
      const newValues = [ ...(values || []) ];
      newValues[index] = undefined;
      set(newValues);
    }
  };
  
  return {
    schema,
    selected,
    values, 
    index, 
    handlers, 
    options
  };
}
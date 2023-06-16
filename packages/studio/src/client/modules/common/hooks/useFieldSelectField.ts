//types
import type { ChangeEvent } from 'react';
import type { FieldMetadataType } from 'frui';
import type { FormChangeHandler, SchemaColumn, SchemaColumnField } from 'inceptjs';
//hooks
import { useState } from 'react';
//helpers
import { getField, getColumnDefaults, fields as options } from '../column';

export type FieldSelectFieldConfig = {
  column?: Partial<SchemaColumn>
  value?: SchemaColumnField, 
  onUpdate?: FormChangeHandler
};

export default function useFieldSelectField(config: FieldSelectFieldConfig) {
  const { column, value, onUpdate } = config;
  const [ selected, setSelected ] = useState(getField(value?.method || ''));
  const [ params, setParams ] = useState<Record<string, any>>({});
  const handlers = {
    method: (e: ChangeEvent<HTMLSelectElement>) => {
      const selected = getField(e.target.value);
      if (!selected) return;
      setSelected(selected);
      onUpdate && onUpdate(null, getColumnDefaults(selected.method, column));
    },
    parameters: (attribute: string, value: any) => {
      setParams({ ...params, [attribute]: value });
      onUpdate && onUpdate(['field', 'attributes', attribute], value);
    },
    attributes: (entries: FieldMetadataType[]) => {
      if (!selected) return;
      const attributes = Object.assign({}, 
        Object.fromEntries(entries),
        params,
        selected?.attributes.fixed || {},
      );
      onUpdate && onUpdate(['field', 'attributes'], attributes);
    }
  };

  return { handlers, selected, options };
};
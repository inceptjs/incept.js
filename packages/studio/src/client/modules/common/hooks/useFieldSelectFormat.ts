//types
import type { ChangeEvent } from 'react';
import type { FieldMetadataType } from 'frui';
import type { FormChangeHandler, SchemaColumnFormat } from 'inceptjs';
//hooks
import { useState } from 'react';
//helpers
import { getField, getFormat, filterFormats, formats } from '../column';

export type FieldSelectFormatConfig = {
  format: 'list'|'view',
  field?: string,
  value?: SchemaColumnFormat, 
  onUpdate?: FormChangeHandler
};

export default function useFieldSelectFormat(config: FieldSelectFormatConfig) {
  const { format, field, value, onUpdate } = config;
  const [ selected, setSelected ] = useState(getFormat(value?.method || ''));
  const [ params, setParams ] = useState<Record<string, any>>({});
  let options = formats;
  if (field) {
    const config = getField(field);
    if (config) {
      options = filterFormats(config[format].filter)
    }
  }
  const handlers = {
    method: (e: ChangeEvent<HTMLSelectElement>) => {
      const selected = getFormat(e.target.value);
      if (!selected) return;
      setSelected(selected);
      onUpdate && onUpdate([format, 'method'], selected.method);
    },
    parameters: (attribute: string, value: any) => {
      setParams({ ...params, [attribute]: value });
      onUpdate && onUpdate([format, 'attributes', attribute], value);
    },
    attributes: (entries: FieldMetadataType[]) => {
      if (!selected) return;
      const attributes = Object.assign({}, 
        Object.fromEntries(entries),
        params,
        selected?.attributes.fixed || {},
      );
      onUpdate && onUpdate([format, 'attributes'], attributes);
    }
  };

  return { handlers, selected, options };
};
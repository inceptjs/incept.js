import type { FormEvent } from 'react';
import type { SchemaColumn, SchemaColumnData, APIResponse } from 'inceptjs';

import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useForm } from 'inceptjs';
import { api } from 'inceptjs/api';
import useMobile from '../../app/layouts/panel/hooks/useMobile';

import notify from '../../common/components/notify';

export default function useField(
  mode: 'create'|'update',
  onSubmit: (column: Partial<SchemaColumn>) => void,
  columns: SchemaColumn[],
  defaultValue?: Partial<SchemaColumn>
) {
  const { t } = useLanguage();
  const [ response, setResponse ] = useState<APIResponse>();
  const { handlers: mobile } = useMobile();
  const { input, handlers } = useForm<SchemaColumn>((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = api.validate.column(input.values);
    if (Object.keys(errors).length) {
      setResponse({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }

    //check if the column already exists
    const exists = columns.find(column => column.name === input.values.name);
    if (mode === 'create' && exists) {
      setResponse({
        error: true,
        code: 400,
        message: 'Column already exists'
      });
      return false;
    } else if (mode === 'update' && exists && exists.name !== originalName) {
      setResponse({
        error: true,
        code: 400,
        message: 'Column already exists'
      });
      return false;
    }

    const values = { ...input.values } as SchemaColumn;
    values.data = api.schema.data(values) as SchemaColumnData;
    if (values.type === 'string|number') {
      switch (values.data.type) {
        case 'int':
        case 'float':
          values.type = 'number';
          break;
        case 'datetime':
          values.type = 'date';
          break;
        case 'char':
        case 'varchar':
        case 'text':
        default:
          values.type = 'string';
          break;
      }
      
    }
    onSubmit(values);

    const message = mode === 'create' 
      ? t`Field ${values.name} created` 
      : t`Field ${values.name} updated`;

    notify('success', message as string);
    mobile.pop();
    return false;
  }, defaultValue);

  const originalName = defaultValue?.name;

  useEffect(() => {
    if (response?.error) {
      notify('error', response.message);
    }
  }, [ response ]);
  return {
    handlers,
    response,
    data: input.values
  };
};
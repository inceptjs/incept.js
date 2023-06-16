import type { FormEvent } from 'react';
import type { SchemaColumn, APIResponse } from 'inceptjs';

import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useForm } from 'inceptjs';
import useMobile from '../../app/layouts/panel/hooks/useMobile';

import notify from '../../common/components/notify';
import { validateColumn } from '../validate';

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
    const errors = validateColumn(input.values);
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

    onSubmit(input.values);
    notify('success', t`Field ${input.values.name} created` as string);
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
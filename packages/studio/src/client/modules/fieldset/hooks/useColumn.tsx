//types
import type { FormEvent } from 'react';
import type { FieldsetColumn, APIResponse } from 'inceptjs';
//hooks
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useForm } from 'inceptjs';
//helpers
import { slugify, camelfy } from 'frui/utils';
import { api } from 'inceptjs/api';
import config from '.incept/server/config.json';
import useMobile from '../../app/layouts/panel/hooks/useMobile';

import notify from '../../common/components/notify';

const lower = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

export default function useColumn(
  mode: 'create'|'update',
  onSubmit: (column: Partial<FieldsetColumn>) => void,
  columns: FieldsetColumn[],
  defaultValue?: Partial<FieldsetColumn>
) {
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const [ response, setResponse ] = useState<APIResponse>();
  const { input, handlers: form } = useForm<FieldsetColumn>((e: FormEvent<Element>) => {
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

    const values = {
      type: api.schema.type(input.values),
      name: input.values.name,
      label: input.values.label,
      field: input.values.field,
      validation: input.values.validation,
      list: input.values.list,
      view: input.values.view
    } as FieldsetColumn;
    onSubmit(values);

    const message = mode === 'create' 
      ? t`Field ${values.name} created` 
      : t`Field ${values.name} updated`;

    notify('success', message as string);
    mobile.pop();
    return false;
  }, defaultValue);
  //controlling unconrolled inputs :)
  const [ slug, setSlug ] = useState(input?.values.name || '');
  //variables
  const originalName = defaultValue?.name;
  const handlers = {
    ...form,
    slug: (value: string) => setSlug(
      config.schema.casing === 'camel' 
        ? lower(camelfy(value))
        : slugify(value, true, false)
    )
  };
  //effects
  useEffect(() => { form.change('name', slug) }, [ slug ]);
  useEffect(() => {
    if (response?.error) {
      notify('error', response.message);
    }
  }, [ response ]);

  return {
    handlers,
    response,
    data: {
      input: input.values,
      slug
    }
  };
};
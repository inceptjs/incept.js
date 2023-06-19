//types
import type { FormEvent } from 'react';
import type { SchemaColumn, SchemaColumnData, APIResponse } from 'inceptjs';
type Paths = string|number|true|(string|number)[]|null;
//hooks
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useForm } from 'inceptjs';
//helpers
import { slugify } from 'frui/utils';
import { api } from 'inceptjs/api';
import useMobile from '../../app/layouts/panel/hooks/useMobile';

import notify from '../../common/components/notify';

export default function useColumn(
  mode: 'create'|'update',
  onSubmit: (column: Partial<SchemaColumn>) => void,
  columns: SchemaColumn[],
  defaultValue?: Partial<SchemaColumn>
) {
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const [ response, setResponse ] = useState<APIResponse>();
  const { input, handlers: form } = useForm<SchemaColumn>((e: FormEvent<Element>) => {
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
      data: {
        type: input.values.data?.type || 'varchar',
        length: input.values.data?.length || 0,
        required: !!input.values.data?.required,
        primary: !!input.values.data?.primary,
        unique: !!input.values.data?.unique,
        unsigned: !!input.values.data?.unsigned
      },
      field: input.values.field,
      validation: input.values.validation,
      list: input.values.list,
      view: input.values.view,
      relation: input.values.relation,
      searchable: !!input.values.searchable,
      filterable: !!input.values.filterable,
      sortable: !!input.values.sortable
    } as SchemaColumn;
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
  const [ dataType, setDataType ] = useState('');
  const [ dataLength, setDataLength ] = useState<number|number[]>(0);
  const [ dataUnsigned, setDataUnsigned ] = useState(false);

  //variables
  const originalName = defaultValue?.name;
  const handlers = {
    ...form,
    slug: (value: string) => setSlug(slugify(value, true, false)),
    dataType: setDataType,
    dataLength: setDataLength,
    dataUnsigned: setDataUnsigned,
    change: (paths: Paths, value: any) => {
      //update the column (bau)
      form.change(paths, value);
      //get the column updates
      const column = form.change(paths, value, false) as SchemaColumn;
      //if the data type is not data, then we need to update the data type
      if (paths !== 'data' || (Array.isArray(paths) && paths[0] !== 'data')) {
        const data = api.schema.data(column) as SchemaColumnData;
        setDataType(data?.type || '');
        setDataLength(data?.length || 0);
        setDataUnsigned(data?.unsigned || false);
      }
    }
  };
  //effects
  useEffect(() => { form.change('name', slug) }, [ slug ]);
  useEffect(() => { form.change(['data', 'type'], dataType) }, [ dataType ]);
  useEffect(() => { form.change(['data', 'length'], dataLength) }, [ dataLength ]);
  useEffect(() => { form.change(['data', 'unsigned'], dataUnsigned) }, [ dataUnsigned ]);
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
      slug,
      dataType,
      dataLength,
      dataUnsigned
    }
  };
};
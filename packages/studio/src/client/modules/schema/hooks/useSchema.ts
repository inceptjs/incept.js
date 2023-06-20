//types
import type { FormEvent } from 'react';
import type { SchemaConfig } from 'inceptjs';
//hooks
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useFetch, useForm } from 'inceptjs';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
//helpers
import { Schema } from 'inceptjs';
import { api } from 'inceptjs/api';
import notify from '../../common/components/notify';

export function useSchemaRemove(name: string, redirect?: () => void) {
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const action = useFetch<SchemaConfig>('delete', '/api/schema/:name');
  const { handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    action.call({ params: { name } }).then(response => {
      if (!response.error) {
        notify('success', t`Schema ${name} removed` as string);
        redirect && redirect();
      }
    });
    return false;
  });
  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return { handlers, mobile, response: action.response };
};

export function useSchemaSearch() {
  //hooks
  const { handlers: mobile } = useMobile();
  const search = useFetch<Record<string, SchemaConfig>>('get', '/api/schema');
  const [ refresh, setRefresh ] = useState(0);
  //effects
  useEffect(() => {
    search.call({}).then((response) => {
      if (response.results) {
        Schema.add(Object.values(response.results));
      }
    });
  }, [ refresh ]);
  //handlers
  const redirect = () => {
    setRefresh(refresh => refresh + 1);
    mobile.pop();
  };
  return { mobile, response: search.response, redirect, Schema };
};

export function useSchemaUpsert(name?: string, redirect?: () => void) {
  //variables
  const method = name ? 'put' : 'post';
  const endpoint = name ? '/api/schema/:name' : '/api/schema';
  const schema = name ? Schema.get(name) : undefined;
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const action = useFetch<SchemaConfig>(method, endpoint);
  const { input, handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = api.validate.schema(input.values, !name);
    if (Object.keys(errors).length) {
      action.set({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }
    action.call({ 
      data: {
        columns: [],
        relations: {},
        ...input.values,
        rest: {
          create: {
            method: 'post',
            path: `/api/${input.values.name}`,
            event: 'system-object-create',
            body: { schema: input.values.name }
          },
          detail: {
            method: 'get',
            path: `/api/${input.values.name}/:id`,
            event: 'system-object-detail',
            body: { schema: input.values.name }
          },
          remove: {
            method: 'delete',
            path: `/api/${input.values.name}/:id`,
            event: 'system-object-remove',
            body: { schema: input.values.name }
          },
          search: {
            method: 'get',
            path: `/api/${input.values.name}`,
            event: 'system-collection-search',
            body: { schema: input.values.name }
          },
          update: {
            method: 'put',
            path: `/api/${input.values.name}/:id`,
            event: 'system-object-update',
            body: { schema: input.values.name }
          }
        },
      }, 
      params: name ? { name } : undefined
    }).then(response => {
      if (!response.error) {
        if (response.results) {
          Schema.add(response.results as SchemaConfig);
        }
        const message = name 
          ? t`Schema ${name} updated` 
          : t`Schema ${response.results?.name} created`;
        notify('success', message as string);
        redirect && redirect();
      }
    });
    return false;
  }, schema || { columns: [], relations: {}, rest: {} });
  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return {
    mobile,
    handlers,
    data: input.values,
    response: action.response
  };
};
//types
import type { FormEvent } from 'react';
import type { FieldsetConfig } from 'inceptjs';
//hooks
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useFetch, useForm } from 'inceptjs';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
//helpers
import { Fieldset } from 'inceptjs';
import { api } from 'inceptjs/api';
import notify from '../../common/components/notify';

export function useFieldsetRemove(name: string, redirect?: () => void) {
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const action = useFetch<FieldsetConfig>('delete', '/api/fieldset/:name');
  const { handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    action.call({ params: { name } }).then(response => {
      if (!response.error) {
        notify('success', t`Fieldset ${name} removed` as string);
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

export function useFieldsetSearch() {
  //hooks
  const { handlers: mobile } = useMobile();
  const search = useFetch<Record<string, FieldsetConfig>>('get', '/api/fieldset');
  const [ refresh, setRefresh ] = useState(0);
  //effects
  useEffect(() => {
    search.call({}).then((response) => {
      if (response.results) {
        Fieldset.add(Object.values(response.results));
      }
    });
  }, [ refresh ]);
  //handlers
  const redirect = () => {
    setRefresh(refresh => refresh + 1);
    mobile.pop();
  };
  return { mobile, response: search.response, redirect, Fieldset };
};

export function useFieldsetUpsert(name?: string, redirect?: () => void) {
  //variables
  const method = name ? 'put' : 'post';
  const endpoint = name ? '/api/fieldset/:name' : '/api/fieldset';
  const fieldset = name ? Fieldset.get(name) : undefined;
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const action = useFetch<FieldsetConfig>(method, endpoint);
  const { input, handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = api.validate.fieldset(input.values, !name);
    if (Object.keys(errors).length) {
      action.set({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }
    action.call({ 
      data: { columns: [], ...input.values }, 
      params: name ? { name } : undefined
    }).then(response => {
      if (!response.error) {
        if (response.results) {
          Fieldset.add(response.results as FieldsetConfig);
        }
        const message = name 
          ? t`Fieldset ${name} updated` 
          : t`Fieldset ${response.results?.name} created`;
        notify('success', message as string);
        redirect && redirect();
      }
    });
    return false;
  }, fieldset || { columns: [] });
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
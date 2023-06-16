//types
import type { FormEvent } from 'react';
import type { SchemaConfig } from 'inceptjs';
//hooks
import { useEffect } from 'react';
import { useLanguage } from 'r22n';
import { useFetch, useForm } from 'inceptjs';
//helpers
import { Schema } from 'inceptjs';
import { redirect } from 'react-router-dom';
import notify, { flash } from '../../common/components/notify';
import validate from '../validate';

export function useSchemaCreate() {
  const { t } = useLanguage();
  const action = useFetch<SchemaConfig>('post', '/api/schema');
  const { input, handlers } = useForm<SchemaConfig>((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = validate(input.values, true);
    if (Object.keys(errors).length) {
      action.set({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }

    action.call({ data: input.values }).then(response => {
      if (!response.error) {
        flash('success', t`Schema ${response.results?.name} created` as string);
        redirect('/schema');
      }
    });
    return false;
  });

  console.log('useSchema', input.values);

  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return {
    handlers,
    data: input.values,
    response: action.response
  };
};

export function useSchemaRemove(name: string) {
  const { t } = useLanguage();
  const action = useFetch<SchemaConfig>('delete', '/api/schema/:name');
  const { handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    action.call({ params: { name } }).then(response => {
      if (!response.error) {
        flash('success', t`Schema ${name} removed` as string);
        redirect('/schema');
      }
    });
    return false;
  });
  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return { handlers, response: action.response };
};

export function useSchemaSearch() {
  const search = useFetch<Record<string, SchemaConfig>>('get', '/api/schema');
  useEffect(() => {
    search.call({}).then((response) => {
      if (response.results) {
        Schema.add(Object.values(response.results));
      }
    });
  }, []);
  return { response: search.response, Schema };
};

export function useSchemaUpdate(name: string) {
  const { t } = useLanguage();
  const action = useFetch<SchemaConfig>('put', '/api/schema/:name');
  const { input, handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = validate(input.values, false);
    if (Object.keys(errors).length) {
      action.set({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }

    action.call({ data: input.values, params: { name } }).then(response => {
      if (!response.error) {
        flash('success', t`Schema ${name} updated` as string);
        redirect('/schema');
      }
    });
    return false;
  });
  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return {
    handlers,
    data: input.values,
    response: action.response
  };
};

export function useSchemaUpsert(name?: string) {
  const { t } = useLanguage();
  const method = name ? 'put' : 'post';
  const endpoint = name ? '/api/schema/:name' : '/api/schema';
  const action = useFetch<SchemaConfig>(method, endpoint);
  const { input, handlers } = useForm((e: FormEvent<Element>) => {
    e.preventDefault();
    const errors = validate(input.values, !name);
    if (Object.keys(errors).length) {
      action.set({
        error: true,
        code: 400,
        message: 'Invalid data'
      });
      return false;
    }

    action.call({ 
      data: input.values, 
      params: name ? { name } : undefined
    }).then(response => {
      if (!response.error) {
        const message = name 
          ? t`Schema ${name} updated` 
          : t`Schema ${response.results?.name} created`;
        flash('success', message as string);
        redirect('/schema');
      }
    });
    return false;
  });
  useEffect(() => {
    if (action.response?.error) {
      notify('error', action.response.message);
    }
  }, [ action.response ]);
  return {
    handlers,
    data: input.values,
    response: action.response
  };
};
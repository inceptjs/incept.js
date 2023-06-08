//types
import type { APIResponse } from '../types';
import type { 
  FetchStatuses, 
  FetchRouteParams, 
  FetchCallConfig 
} from '../types';
//hooks
import { useState } from 'react';
//others
import axios from 'axios';

function route(path: string, route: FetchRouteParams) {
  for (const arg of route.args) {
    path = path.replace('*', String(arg));
  }

  for (const param in route.params) {
    path = path
      .replace(`:${param}`, String(route.params[param]))
      .replace(`[${param}]`, String(route.params[param]));
  }

  return path;
}

export default function useFetch<Model = any>(
  method: string, 
  url: string, 
  options: Record<string, any> = {}
) {
  //variables
  options.validateStatus = (status: number) => status < 500;
  //hooks
  const [ status, setStatus ] = useState<FetchStatuses>('pending');
  const [ response, set ] = useState<APIResponse<Model>>();
  //callbacks
  const reset = () => {
    set(undefined);
    setStatus('pending');
  };
  const call = async (options: FetchCallConfig) => {
    const config: Record<string, any> = { ...options, method };
    if (options.query) {
      config.params = options.query;
    }
    if (options.data) {
      config.data = options.data;
    }

    const args = options.args || [];
    const params = options.params || {};
    const path = route(url, { args, params });

    setStatus('fetching');
    const response = await axios(path, config).catch(e => ({
      data: {
        error: true,
        message: e.message || e
      }
    }));
    setStatus('complete');
    set(response.data);
  };

  return { call, set, reset, status, response };
};
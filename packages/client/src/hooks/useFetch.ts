//types
import type { APIResponse, FetchStatuses } from '../types';
//hooks
import { useState } from 'react';
//others
import axios from 'axios';

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
  const call = async (...args: any[]) => {
    const config: Record<string, any> = { ...options, method };
    let path = url;
    for (const arg of args ) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        path = path.replace('%s', String(arg));
      } else if (typeof arg === 'object') {
        if (method.toUpperCase() === 'GET') {
          config.params = arg;
        } else {
          if (config.data) {
            config.params = arg;
          } else {
            config.data = arg;
          }
        }
      }
    }

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
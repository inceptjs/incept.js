//types
import type { FormEvent } from 'react';
//hooks
import { useState } from 'react';
//helpers
import { Store } from '@inceptjs/types';

/**
 * Factory that returns form helpers
 */
export default function useForm<Model = any>(
  send: (e: FormEvent) => boolean,
  data: Partial<Model> = {}
) {
  //hooks
  const [ inputs, setInputs ] = useState<Partial<Model>>(data);
  //variables
  const input = { values: inputs, set: setInputs };
  const handlers = {
    send,
    change(paths: string|string[], value: any) {
      //make sure paths is a string
      if (typeof paths === 'string') {
        paths = [ paths ];
      }
  
      const store = new Store(inputs);
      if (typeof value === 'undefined' 
        || (typeof value === 'string' && !value.trim().length)
      ) {
        store.remove(...paths);
      } else {
        store.set(...paths, value);
      }

      setInputs({ ...(store.get() as Partial<Model>) });
    }
  };

  return { input, handlers };
};
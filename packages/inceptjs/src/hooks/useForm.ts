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
    change(paths: null|true|string|number|(string|number)[], value: any) {
      //if null
      if (paths === null) {
        //if value is an object hash
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          //set all the inputs (hard override)
          setInputs({...value});
        }
        return;  
      }
      //if true
      if (paths === true) {
        //if value is an object hash
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          //set all the inputs (soft override)
          setInputs({ ...inputs, ...value });
        }
        return;  
      }
      //make sure paths is a string
      if (!Array.isArray(paths)) {
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

      setInputs({...(store.get() as Partial<Model>)});
    }
  };

  return { input, handlers };
};
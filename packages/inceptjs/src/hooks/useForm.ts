//types
import type { FormEvent } from 'react';
type Paths = null|true|string|number|(string|number)[];
//hooks
import { useState } from 'react';
//helpers
import { Store } from '@inceptjs/types';

const update = <Model = Record<string, any>>(
  inputs: Partial<Model>, 
  paths: Paths, 
  value: any
) => {
  //if null
  if (paths === null) {
    //if value is an object hash
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return { ...value } as Partial<Model>;
    }
    return { ...inputs } as Partial<Model>;
  }
  //if true
  if (paths === true) {
    //if value is an object hash
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      //set all the inputs (soft override)
      return { ...inputs, ...value } as Partial<Model>;
    }
    return { ...inputs } as Partial<Model>;  
  }
  //make sure paths is a string
  if (!Array.isArray(paths)) {
    paths = [ paths ];
  }
  const store = new Store(inputs || {});
  if (typeof value === 'undefined' 
    || (typeof value === 'string' && !value.trim().length)
  ) {
    store.remove(...paths);
  } else {
    store.set(...paths, value);
  }

  return { ...store.get() } as Partial<Model>;
};

/**
 * Factory that returns form helpers
 */
export default function useForm<Model = Record<string, any>>(
  send: (e: FormEvent) => boolean,
  data: Partial<Model> = {}
) {
  //hooks
  const [ inputs, setInputs ] = useState<Partial<Model>>(data);
  //variables
  const input = { values: inputs, set: setInputs };
  const handlers = {
    send,
    change(
      paths: Paths, 
      value: any,
      save = true
    ) {
      const values = update<Model>(inputs, paths, value);
      if (save) {
        setInputs(values);
        return;
      }
      return values;
    }
  };

  return { input, handlers };
};
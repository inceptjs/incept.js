//types
import type { ChangeEvent } from 'react';
import type { FieldFilelistConfig } from './types';
//hooks
import { useState, useEffect } from 'react';
import useInput from './useFieldInput';

export default function useFieldFilelist(config: FieldFilelistConfig) {
  const {
    defaultValue,
    onChange, 
    onUpdate,
    onUpload
  } = config;
  const [ queued, setQueue ] = useState(0);
  const [ uploaded, setUploaded ] = useState<string[]>(defaultValue || []);
  useEffect(() => {
    onUpdate && onUpdate(uploaded);
  }, [ uploaded ]);
  const handlers = {
    change: (e: ChangeEvent<HTMLInputElement>) => {
      if (onUpload && e.target.files) {
        const pending = Array.from(e.target.files);
        const queue = queued + pending.length;
        setQueue(queue);
        const values: string[] = uploaded;
        onUpload(pending, urls => {
          const updated = queue - urls.length;
          values.push(...urls);
          setQueue(updated > 0 ? updated : 0);
          setUploaded([ ...values ]);
        });
      }
      
      onChange && onChange(e);
    },
    remove: (index: number) => {
      setQueue(queued ? queued - 1: 0);
      const keepUploaded = [ ...uploaded ];
      keepUploaded.splice(index, 1);
      setUploaded(keepUploaded);
    },
    reset: () => {
      setQueue(0);
      setUploaded([]);
    }
  }
  useInput({ onChange: handlers.change, onUpdate })

  return { queued, uploaded, handlers };  
};
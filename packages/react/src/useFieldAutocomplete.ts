//types
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import type { FieldAutocompleteConfig } from './types';
//hooks
import { useState } from 'react';

export default function useFieldAutocomplete(config: FieldAutocompleteConfig) {
  const { 
    defaultValue,
    onQuery,
    onDropdown,
    onChange,
    onUpdate
  } = config;
  //hooks
  //controlled input value
  const [ value, setValue ] = useState(defaultValue || '');
  //search query string
  const [ query, setQuery ] = useState('');
  //whether to show dropdown
  const [ showing, show ] = useState(false);
  //handlers
  const handlers = {
    //updates query string on key down
    search: (e: KeyboardEvent) => {
      show(true);
      onDropdown && onDropdown(true);
      setTimeout(() => {
        const input = e.target as HTMLInputElement;
        setQuery(input.value);
        onQuery && onQuery(input.value);
      });
    },
    //send the input value on input change
    update: (e: ChangeEvent<HTMLInputElement>) => {
      onChange && onChange(e);
      onUpdate && onUpdate(e.target.value);
      setValue(e.target.value);
    },
    //matches options with query string
    match: (option: string) => {
      const keyword = (query || '').toLowerCase();
      return query.length && option.toLowerCase().indexOf(keyword) >= 0;
    },
    //selects an option from the dropdown
    select: (option: string) => {
      show(false);
      onDropdown && onDropdown(false);
      onUpdate && onUpdate(option);
      setValue(option);
      if (onChange) {
        //simulate input change event
        const e = { target: { value: option } };
        onChange(e as ChangeEvent<HTMLInputElement>);
      }
    },
    //hide dropdown on blur
    blur: (e: FocusEvent<HTMLInputElement>) => {
      setTimeout(() => show(false), 10)
    }
  };

  return { value, showing, handlers };
};
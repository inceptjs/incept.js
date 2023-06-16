//type
import type { FieldSelectOption } from 'frui';

import React from 'react';
import icons from '../icons.json';

const options = icons.map(icon => ({
  label: React.createElement('span', {}, 
    React.createElement('i', { className: `mr-2 ${icon}` }), 
    icon
  ), 
  value: icon,
  keyword: icon.split('fa-')[1]
}));

export default function useSelectIcon(value?: string|FieldSelectOption) {
  const selected = typeof value === 'string' 
    ? options.filter(option => option.value === value)[0]
    : value;
  return { selected, options };
};
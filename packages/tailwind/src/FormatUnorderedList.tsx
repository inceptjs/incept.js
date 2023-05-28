//types
import type { FormatUnorderedListProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatUnorderedList: React.FC<FormatUnorderedListProps> = ({ value }) => {
  return (<ul>{value.map((item, index) => (<li key={index}>{item}</li>))}</ul>);
};

export default FormatUnorderedList;
//types
import type { FormatUnorderedListProps } from '../types';
//react
import React from 'react';

const FormatUnorderedList: React.FC<FormatUnorderedListProps> = ({ value }) => {
  return (<ul>{value.map((item, index) => (<li key={index}>{item}</li>))}</ul>);
};

export default FormatUnorderedList;
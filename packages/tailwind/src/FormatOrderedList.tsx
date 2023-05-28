//types
import type { FormatOrderedListProps } from '../types';
//react
import React from 'react';

const FormatOrderedList: React.FC<FormatOrderedListProps> = ({ value }) => {
  return (
    <ol>
      {value.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export default FormatOrderedList;
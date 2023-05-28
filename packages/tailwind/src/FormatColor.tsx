//types
import type { FormatColorProps } from '../types';
//react
import React from 'react';

const FormatColor: React.FC<FormatColorProps> = ({ value }) => {
  //TODO: add color box
  return (
    <span style={{ color: value }}>
      {value}
    </span>
  );
};

export default FormatColor;
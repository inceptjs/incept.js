//types
import type { FormatCommaSeparatedProps } from '../types';
//react
import React from 'react';

const FormatCommaSeparated: React.FC<FormatCommaSeparatedProps> = ({ value }) => {
  return (
    <>{value.join(', ')}</>
  );
};

export default FormatCommaSeparated;
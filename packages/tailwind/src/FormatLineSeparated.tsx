//types
import type { FormatLineSeparatedProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatLineSeparated: React.FC<FormatLineSeparatedProps> = ({ value }) => {
  return (
    <>{value.join('\n')}</>
  );
};

export default FormatLineSeparated;
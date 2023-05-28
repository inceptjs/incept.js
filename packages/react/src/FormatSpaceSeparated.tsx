//types
import type { FormatSpaceSeparatedProps } from './types';
//react
import React from 'react';

const FormatSpaceSeparated: React.FC<FormatSpaceSeparatedProps> = ({ value }) => {
  return (<>{value.join(' ')}</>);
};

export default FormatSpaceSeparated;
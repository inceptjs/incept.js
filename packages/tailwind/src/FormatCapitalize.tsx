//types
import type { FormatCapitalizeProps } from '../types';
//react
import React from 'react';

const FormatCapitalize: React.FC<FormatCapitalizeProps> = ({ value }) => {
  return <>{value.charAt(0).toUpperCase() + value.slice(1)}</>;
};

export default FormatCapitalize;
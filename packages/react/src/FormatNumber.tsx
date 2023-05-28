//types
import type { FormatNumberProps } from './types';
//react
import React from 'react';

const FormatNumber: React.FC<FormatNumberProps> = ({ value }) => {
  return (<>{value}</>);
};

export default FormatNumber;
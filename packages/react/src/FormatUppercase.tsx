//types
import type { FormatUppercaseProps } from './types';
//react
import React from 'react';

const FormatUppercase: React.FC<FormatUppercaseProps> = ({ value }) => {
  return (<>{value.toUpperCase()}</>);
};

export default FormatUppercase;
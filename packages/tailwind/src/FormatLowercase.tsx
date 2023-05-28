//types
import type { FormatLowercaseProps } from '../types';
//react
import React from 'react';

const FormatLowercase: React.FC<FormatLowercaseProps> = ({ value }) => {
  return (
    <span>{value.toLowerCase()}</span>
  );
};

export default FormatLowercase;
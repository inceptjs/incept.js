//types
import type { FormatDateProps } from '../types';
//react
import React from 'react';

const FormatDate: React.FC<FormatDateProps> = ({ value }) => {
  const date = new Date(value);
  return (
    <>{date.toLocaleDateString()}</>
  );
};

export default FormatDate;
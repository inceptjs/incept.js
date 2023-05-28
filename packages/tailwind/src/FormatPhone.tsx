//types
import type { FormatPhoneProps } from '../types';
//react
import React from 'react';

const FormatPhone: React.FC<FormatPhoneProps> = ({ value }) => {
  return (<a href={`tel:${value}`}>{value}</a>);
};

export default FormatPhone;
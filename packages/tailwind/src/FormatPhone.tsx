//types
import type { FormatPhoneProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatPhone: React.FC<FormatPhoneProps> = ({ value }) => {
  return (<a href={`tel:${value}`}>{value}</a>);
};

export default FormatPhone;
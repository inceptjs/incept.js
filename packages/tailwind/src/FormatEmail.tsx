//types
import type { FormatEmailProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatEmail: React.FC<FormatEmailProps> = ({ value }) => {
  return (<a href={`mailto:${value}`}>{value}</a>);
};

export default FormatEmail;
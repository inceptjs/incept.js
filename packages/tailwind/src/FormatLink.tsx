//types
import type { FormatLinkProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatLink: React.FC<FormatLinkProps> = ({ value, label }) => {
  return (<a href={value}>{label}</a>);
};

export default FormatLink;
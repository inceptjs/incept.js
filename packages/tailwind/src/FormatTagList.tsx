//types
import type { FormatTagListProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatTagList: React.FC<FormatTagListProps> = ({ value }) => {
  return (<>{value.join(', ')}</>);
};

export default FormatTagList;
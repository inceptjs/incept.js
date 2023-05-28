//types
import type { FormatWordCountProps } from './types';
//react
import React from 'react';

const FormatWordCount: React.FC<FormatWordCountProps> = ({ value, count }) => {
  return (<>{value.split(' ').slice(0, count).join(' ')}</>);
};

export default FormatWordCount;
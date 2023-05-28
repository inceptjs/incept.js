//types
import type { FormatCharCountProps } from '../types';
//react
import React from 'react';

const FormatCharCount: React.FC<FormatCharCountProps> = ({ value, count }) => {
  return (<>{value.substring(0, count)}</>);
};

export default FormatCharCount;
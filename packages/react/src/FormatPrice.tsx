//types
import type { FormatPriceProps } from './types';
//react
import React from 'react';

const FormatPrice: React.FC<FormatPriceProps> = ({ value }) => {
  return (<>{value}</>);
};

export default FormatPrice;
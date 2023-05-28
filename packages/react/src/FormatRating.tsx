//types
import type { FormatRatingProps } from './types';
//react
import React from 'react';

const FormatRating: React.FC<FormatRatingProps> = ({ value }) => {
  return (<>{value}</>);
};

export default FormatRating;
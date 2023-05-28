//types
import type { FormatRatingProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatRating: React.FC<FormatRatingProps> = ({ value }) => {
  return (<>{value}</>);
};

export default FormatRating;
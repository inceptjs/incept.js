import React from 'react';

const FormatRating: React.FC<{ value: string|number }> = ({ value }) => {
  return (<>{value}</>);
};

export default FormatRating;
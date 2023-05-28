import React from 'react';

const FormatUppercase: React.FC<{ value: string }> = ({ value }) => {
  return (<>{value.toUpperCase()}</>);
};

export default FormatUppercase;
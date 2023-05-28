import React from 'react';

const FormatPhone: React.FC<{ value: string }> = ({ value }) => {
  return (<a href={`tel:${value}`}>{value}</a>);
};

export default FormatPhone;
import React from 'react';

const FormatEmail: React.FC<{ value: string }> = ({ value }) => {
  return (<a href={`mailto:${value}`}>{value}</a>);
};

export default FormatEmail;
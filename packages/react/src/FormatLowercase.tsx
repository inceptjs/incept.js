import React from 'react';

const FormatLowercase: React.FC<{ value: string }> = ({ value }) => {
  return (
    <span>{value.toLowerCase()}</span>
  );
};

export default FormatLowercase;
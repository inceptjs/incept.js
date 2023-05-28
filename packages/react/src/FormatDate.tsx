import React from 'react';

const FormatDate: React.FC<{ value: string|number|Date }> = ({ value }) => {
  const date = new Date(value);
  return (
    <>{date.toLocaleDateString()}</>
  );
};

export default FormatDate;
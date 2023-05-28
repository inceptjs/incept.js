import React from 'react';

const FormatCapitalize: React.FC<{ value: string }> = ({ value }) => {
  return <>{value.charAt(0).toUpperCase() + value.slice(1)}</>;
};

export default FormatCapitalize;
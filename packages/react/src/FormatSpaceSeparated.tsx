import React from 'react';

const FormatSpaceSeparated: React.FC<{ value: string[] }> = ({ value }) => {
  return (<>{value.join(' ')}</>);
};

export default FormatSpaceSeparated;
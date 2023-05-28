import React from 'react';

const FormatJSON: React.FC<{ value: any }> = ({ value }) => {
  return <pre>{JSON.stringify(value, null, 2)}</pre>
};

export default FormatJSON;
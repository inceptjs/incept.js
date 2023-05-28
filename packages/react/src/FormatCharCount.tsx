import React from 'react';

const FormatCharCount: React.FC<{ 
  value: string
  count: number, 
}> = ({ value, count }) => {
  return (<>{value.substring(0, count)}</>);
};

export default FormatCharCount;
import React from 'react';

const FormatWordCount: React.FC<{ 
  value: string, 
  count: number 
}> = ({ value, count }) => {
  return (<>{value.split(' ').slice(0, count).join(' ')}</>);
};

export default FormatWordCount;
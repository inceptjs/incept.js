import React from 'react';

const FormatTagList: React.FC<{ value: string[] }> = ({ value }) => {
  return (<>{value.join(', ')}</>);
};

export default FormatTagList;
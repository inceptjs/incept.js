import React from 'react';

const FormatUnorderedList: React.FC<{ value: string[] }> = ({ value }) => {
  return (<ul>{value.map((item, index) => (<li key={index}>{item}</li>))}</ul>);
};

export default FormatUnorderedList;
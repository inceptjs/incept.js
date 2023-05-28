import React from 'react';

const FormatLink: React.FC<{ 
  value: string, 
  label: string 
}> = ({ value, label }) => {
  return (<a href={value}>{label}</a>);
};

export default FormatLink;
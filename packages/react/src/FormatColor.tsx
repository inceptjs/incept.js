import React from 'react';

const FormatColor: React.FC<{ value: string }> = ({ value }) => {
  //TODO: add color box
  return (
    <span style={{ color: value }}>
      {value}
    </span>
  );
};

export default FormatColor;
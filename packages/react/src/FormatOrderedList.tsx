import React from 'react';

const FormatOrderedList: React.FC<{ value: string[] }> = ({ value }) => {
  return (
    <ol>
      {value.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  );
};

export default FormatOrderedList;
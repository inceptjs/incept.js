import React from 'react';

const FormatLineSeparated: React.FC<{ 
  value: (string|number)[] 
}> = ({ value }) => {
  return (
    <>{value.join('\n')}</>
  );
};

export default FormatLineSeparated;
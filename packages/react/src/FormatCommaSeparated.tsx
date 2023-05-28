import React from 'react';

const FormatCommaSeparated: React.FC<{ 
  value: (string|number)[] 
}> = ({ value }) => {
  return (
    <>{value.join(', ')}</>
  );
};

export default FormatCommaSeparated;
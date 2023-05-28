import React from 'react';

const FormatHTML: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: value }} />
  );
};

export default FormatHTML;
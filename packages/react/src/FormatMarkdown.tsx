import React from 'react';

const FormatMarkdown: React.FC<{ value: string }> = ({ value }) => {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default FormatMarkdown;
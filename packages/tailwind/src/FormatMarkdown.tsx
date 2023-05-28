//types
import type { FormatMarkdownProps } from '../types';
//react
import React from 'react';

const FormatMarkdown: React.FC<FormatMarkdownProps> = ({ value }) => {
  return (
    <div
      className="markdown"
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

export default FormatMarkdown;
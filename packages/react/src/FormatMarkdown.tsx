//types
import type { FormatMarkdownProps } from './types';
//react
import React from 'react';
//components
import ReactMarkdown from 'react-markdown';

const FormatMarkdown: React.FC<FormatMarkdownProps> = ({ value }) => {
  return (
    <ReactMarkdown children={value} />
  );
};

export default FormatMarkdown;
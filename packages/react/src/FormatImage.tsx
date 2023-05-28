import type { HTMLImageProps } from '../types';
import React from 'react';

const FormatImage: React.FC<HTMLImageProps & { 
  value: string,
}> = ({ value, ...attributes }) => {
  return (
    <img {...attributes} src={value} />
  );
};

export default FormatImage;
//types
import type { FormatJSONProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';

const FormatJSON: React.FC<FormatJSONProps> = ({ value }) => {
  return <pre>{JSON.stringify(value, null, 2)}</pre>
};

export default FormatJSON;
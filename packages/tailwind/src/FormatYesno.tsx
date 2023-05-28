//types
import type { FormatYesnoProps } from '../types';
//react
import React from 'react';

const FormatYesno: React.FC<FormatYesnoProps> = ({ value }) => {
  return (<>{!!value ? 'Yes' : 'No'}</>);
};

export default FormatYesno;
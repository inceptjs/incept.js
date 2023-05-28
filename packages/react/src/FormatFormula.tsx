//types
import type { FormatFormulaProps } from './types';
//react
import React from 'react';

const FormatFormula: React.FC<FormatFormulaProps> = ({ value, data }) => {
  //TODO: fix
  return (
    <span>
      {value.replace(/{{([^}]+)}}/g, (_, key) => {
        return data[key];
      })}
    </span>
  );
};

export default FormatFormula;
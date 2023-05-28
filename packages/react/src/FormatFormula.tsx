import React from 'react';

const FormatFormula: React.FC<{ 
  value: string, 
  data: Record<string, any> 
}> = ({ value, data }) => {
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
import React from 'react';

const FormatYesno: React.FC<{ value: any }> = ({ value }) => {
  return (<>{!!value ? 'Yes' : 'No'}</>);
};

export default FormatYesno;
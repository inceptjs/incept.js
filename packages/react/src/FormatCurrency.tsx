import React from 'react';
import countries from '../countries.json';

const FormatCurrency: React.FC<{ value: string }> = ({ value }) => {
  const country = countries.find(country => country.currencyCode === value);
  return (
    <>{country ? country.currencyName : value}</>
  );
};

export default FormatCurrency;
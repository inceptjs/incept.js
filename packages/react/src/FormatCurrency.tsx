//types
import type { FormatCurrencyProps } from './types';
//react
import React from 'react';
//helpers
import countries from '@inceptjs/data/countries.json';

const FormatCurrency: React.FC<FormatCurrencyProps> = ({ value }) => {
  const country = countries.find(country => country.currencyCode === value);
  return (
    <>{country ? country.currencyName : value}</>
  );
};

export default FormatCurrency;
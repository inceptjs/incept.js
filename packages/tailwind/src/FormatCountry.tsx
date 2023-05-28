//types
import type { FormatCountryProps } from '../types';
//react
import React from 'react';
//helpers
import countries from '../countries.json';

const FormatCountry: React.FC<FormatCountryProps> = ({ value }) => {
  const country = countries.find(country => country.countryCode === value);
  //TODO: add flag
  return (<>{country ? country.countryName : value}</>);
};

export default FormatCountry;
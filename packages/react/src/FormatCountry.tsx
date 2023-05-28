import React from 'react';
import countries from '../countries.json';

const FormatCountry: React.FC<{ value: string }> = ({ value }) => {
  const country = countries.find(country => country.countryCode === value);
  //TODO: add flag
  return (<>{country ? country.countryName : value}</>);
};

export default FormatCountry;
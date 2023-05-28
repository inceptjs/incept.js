//types
import type { FieldCountryProps } from '@inceptjs/react/dist/types';
//react
import React from 'react';
//components
import FieldSelect from './FieldSelect';
//hooks
import useFieldCountry from '@inceptjs/react/dist/useFieldCountry';

/**
 * Styled Country Field Component (Main)
 */
const FieldCountry: React.FC<FieldCountryProps> = (props) => {
  const { value, placeholder = 'Choose a Country', ...attributes } = props;
  const { selected, options } = useFieldCountry({
    value, 
    map: country => ({
      label: (
        <>
          <img 
            alt={`${country.countryName} Flag`} 
            src={`https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`} 
            loading="lazy"
          />
          <span className="inline-block ml-2">{country.countryName}</span>  
        </>
      ),
      value: country,
      keyword: (keyword: string) => country.countryCode.toLowerCase().indexOf(keyword) >= 0
        || country.countryName.toLowerCase().indexOf(keyword) >= 0
        || country.currencyCode.toLowerCase().indexOf(keyword) >= 0
    })
  });

  return (
    <FieldSelect 
      {...attributes} 
      placeholder={placeholder} 
      value={selected} 
      options={options} 
      searchable={true} 
    />
  );
};

export default FieldCountry;
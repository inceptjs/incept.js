//type
import type { 
  ExtendsType, 
  FieldSelectProps, 
  FieldSelectOption 
} from 'frui';
//react
import React from 'react';
//components
import FieldSelect from 'frui/tailwind/FieldSelect';
//hooks
import useFieldSelectIcon from '../hooks/useFieldSelectIcon';

const FieldSelectIcon: React.FC<ExtendsType<FieldSelectProps, {
  options?: undefined,
  defaultValue?: string|FieldSelectOption
}>> = (props) => {
  const { 
    defaultValue, 
    placeholder = 'Choose an Icon', 
    ...attributes 
  } = props;
  const { selected, options } = useFieldSelectIcon(defaultValue);

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

export default FieldSelectIcon;
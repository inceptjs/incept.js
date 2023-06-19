//types
import type { FieldSelectOption, FieldsProps, FieldsetProps } from 'frui';
import type { FieldRelationlistType } from '../hooks/useFieldRelationlist';
//react
import React from 'react';
//hooks
import useFieldRelationlist from '../hooks/useFieldRelationlist';
//components
import Control from 'frui/tailwind/Control';
import Button from 'frui/tailwind/Button';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldSelect from 'frui/tailwind/FieldSelect';
import make from 'frui/tailwind/Fieldset';
import { SchemaColumn } from 'inceptjs';
//helpers
import { makeGroupClasses } from 'frui/utils';

const Fields: React.FC<FieldsProps<FieldRelationlistType>> = (props) => {
  const {
    data,
    values, 
    index, 
    //error,
    classNames,
    set
  } = props;

  //handlers
  const columns = (data?.columns || []) as SchemaColumn[];
  const { selected, handlers, options } = useFieldRelationlist(
    { columns, values, index, set }
  );

  //variables
  const map = makeGroupClasses(classNames, {
    row: 'mt-1 relative border dark:border-b1 p-4',
    button: 'flex items-center justify-center ml-0.5 dark:border-[#242931] dark:bg-[#242931]',
    label: 'dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-slate-500 outline-none',
    control: 'dark:bg-b5 dark:text-t1 dark:border-b1',
    placeholder: 'dark:text-gray-500',
    dropdown: 'dark:bg-b3',
    option: 'dark:border-b1',
    type: 'dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-slate-500 outline-none'
  });

  const types: FieldSelectOption<string>[] = [
    { label: 'Zero-to-One', value: '0:1' },
    { label: 'One-to-One', value: '1:1' },
    { label: 'One-to-Many', value: '1:N' },
    { label: 'Many-to-Many', value: 'N:N' }
  ];

  return (
    <div className={map.row}>
      <Control label="Label">
        <div className="flex items-center">
          <FieldInput 
            className={map.label}
            defaultValue={selected?.label}
            onUpdate={value => handlers.update({ 
              ...(selected || {}), 
              label: value as string || ''
            })}
          />
          <Button 
            transparent
            danger
            onClick={handlers.remove}
            className={map.button}
          >
            &times;
          </Button>
        </div>
      </Control>
      <div className="flex items-center relative z-2 mt-2">
        <Control label="Type" className="basis-1/2">
          <FieldSelect  
            classNames={{
              control: map.control,
              placeholder: map.placeholder,
              dropdown: map.dropdown,
              option: map.option
            }}
            placeholder="Choose a Type" 
            value={types.find(
              type => type.value === selected?.type
            ) || undefined} 
            options={types} 
            onUpdate={value => handlers.update({ 
              ...(selected || {}), 
              type: value as ('0:1'|'1:1'|'1:N'|'N:N') || '0:1'
            })}
          />
        </Control>
        <Control label="From" className="basis-1/2">
          <FieldSelect  
            classNames={{
              control: map.control,
              placeholder: map.placeholder,
              dropdown: map.dropdown,
              option: map.option
            }}
            placeholder="Choose Column" 
            value={options.from.find(
              column => column.value === selected.from
            ) || undefined} 
            options={options.from} 
            onUpdate={value => handlers.update({ 
              ...(selected || {}), 
              from: value as string || ''
            })}
          />
        </Control>
      </div>
      <div className="flex items-center relative z-1 mt-2">
        <Control label="Schema" className="basis-1/2">
          <FieldSelect 
            classNames={{
              control: map.control,
              placeholder: map.placeholder,
              dropdown: map.dropdown,
              option: map.option
            }}
            placeholder={'Choose Schema'} 
            value={options.schemas.find(
              schema => schema.value === selected.schema
            ) || undefined}
            options={options.schemas} 
            onUpdate={value => handlers.update({ 
              ...(selected || {}), 
              schema: value as string || ''
            })}
          />
        </Control>
        <Control label="To" className="basis-1/2">
          <FieldSelect  
            classNames={{
              control: map.control,
              placeholder: map.placeholder,
              dropdown: map.dropdown,
              option: map.option
            }}
            placeholder="Choose Column" 
            value={options.to.find(
              column => column.value === selected.to
            ) || undefined} 
            options={options.to} 
            onUpdate={value => handlers.update({ 
              ...(selected || {}), 
              to: value as string || ''
            })}
          />
        </Control>
      </div>
      
    </div>
  );
};

const Fieldset = make<FieldRelationlistType>(Fields);

/**
 * Validationlist (Main)
 */
const FieldRelationlist: React.FC<FieldsetProps<FieldRelationlistType>> = (props) => {
  return (
    <Fieldset {...props} emptyValue={{
      label: '',
      schema: '',
      from: '',
      to: '',
      type: '0:1'
    }} />
  );
}

export default FieldRelationlist;
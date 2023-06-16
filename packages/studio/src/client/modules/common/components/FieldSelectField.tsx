//types
import type { FormChangeHandler, SchemaColumn, SchemaColumnField } from 'inceptjs';
//react
import React from 'react';
//hooks
import { useLanguage } from 'r22n';
import useFieldSelectField from '../hooks/useFieldSelectField';
//components
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldSelect from 'frui/tailwind/FieldSelect';
import FieldMetadata from 'frui/tailwind/FieldMetadata';
import FieldTextlist from 'frui/tailwind/FieldTextlist';

const FieldSelectField: React.FC<{ 
  column?: Partial<SchemaColumn>,
  value?: SchemaColumnField,
  style?: React.CSSProperties,
  className?: string,
  onUpdate?: FormChangeHandler
}> = (props) => {
  const { t } = useLanguage();
  const { column, value, onUpdate, ...attributes } = props;
  const { selected, options, handlers } = useFieldSelectField(
    { value, column, onUpdate }
  );

  const groupless = Object.values(
    Object
      .keys(options)
      .filter(group => !group.length)
      .map(group => options[group])[0] || {}
  ) || {};

  return (
    <div>
      <select 
        {...attributes} 
        onChange={handlers.method} 
        defaultValue={value?.method}
      >
        {groupless.map(option => (
          <option key={option.method} value={option.method}>
            {option.label}
          </option>
        ))}
        {Object.keys(options).filter(group => group.length > 0).map(group => (
          <optgroup key={group} label={group}>
            {Object.keys(options[group]).map(name => (
              <option key={name} value={name}>
                {options[group][name].label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {!!selected?.params.length && (
        <div>
          {selected.params.map((param, i) => param.field === 'text' 
          ? (
            <Control key={i} className="mt-0.5">
              <FieldInput 
                {...(param.attributes || {})}
                className="outline-none dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-gray-500"
                defaultValue={value?.attributes[param.attribute]} 
                onUpdate={value => handlers.parameters(param.attribute, value)} 
              />
            </Control>
          ) : param.field === 'select' ? (
            <Control key={i} className="mt-0.5">
              <FieldSelect
                {...(param.attributes || {})}
                options={param.attributes.options}
                classNames={{
                  control: 'dark:bg-b5 dark:text-t1 dark:border-b1',
                  placeholder: 'dark:text-gray-500',
                  dropdown: 'dark:bg-b3',
                  option: 'dark:border-b1'
                }}
                value={value?.attributes[param.attribute]} 
                onUpdate={value => handlers.parameters(param.attribute, value)} 
              />
            </Control>
          ) : param.field === 'metadata' ? (
            <Control key={i} className="mt-0.5">
              <FieldMetadata
                {...(param.attributes || {})}
                className="box-border w-full dark:border-b0 darK:bg-b5 dark:text-t1"
                classNames={{
                  name: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
                  value: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
                  button: 'border-0 dark:bg-b2'
                }}
                value={value?.attributes[param.attribute]} 
                onUpdate={value => handlers.parameters(param.attribute, Object.fromEntries(value))} 
              />
            </Control>
          ) : param.field === 'textlist' ? (
            <Control key={i} className="mt-0.5">
              <FieldTextlist
                {...(param.attributes || {})}
                className="box-border w-full dark:border-b0 darK:bg-b5 dark:text-t1"
                classNames={{
                  value: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
                  button: 'border-0 dark:bg-b2'
                }}
                value={value?.attributes[param.attribute]} 
                onUpdate={value => handlers.parameters(param.attribute, value)} 
              />
            </Control>
          ): null)}
        </div>
      )}
      {!!selected?.attributes.show && (
        <Control className="mt-1">
          <FieldMetadata 
            label={t`Add Attribute` as string}
            className="box-border w-full dark:border-b0 darK:bg-b5 dark:text-t1"
            classNames={{
              name: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
              value: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
              button: 'border-0 dark:bg-b2'
            }}
            value={Object.entries(value?.attributes || {})}
            onUpdate={handlers.attributes}
          />
        </Control>
      )}
    </div>
  );
};

export default FieldSelectField;
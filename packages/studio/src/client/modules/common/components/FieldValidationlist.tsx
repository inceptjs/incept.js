//types
import type { FieldsProps, FieldsetProps } from 'frui';
import type { ValidatorMethod } from 'inceptjs';
import type { FieldValidationlistType } from '../hooks/useFieldValidationlist';
//react
import React from 'react';
//components
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldTextlist from 'frui/tailwind/FieldTextlist';
import Button from 'frui/tailwind/Button';
import make from 'frui/tailwind/Fieldset';
//hooks
import useFieldValidationlist from '../hooks/useFieldValidationlist';
//helpers
import { makeGroupStyles, makeGroupClasses } from 'frui/utils';

/**
 * Text Item Component 
 */
const Fields: React.FC<FieldsProps<FieldValidationlistType>> = (props) => {
  const { 
    type,
    values, 
    index, 
    //error,
    styles,
    classNames,
    set
  } = props;
  //variables
  const map = {
    styles: makeGroupStyles(styles, {
      row: undefined,
      button: undefined,
      method: undefined,
      input: undefined
    }),
    classNames: makeGroupClasses(classNames, {
      row: 'mt-0.5',
      button: 'flex items-center justify-center ml-0.5 dark:border-[#242931] dark:bg-[#242931]',
      method: 'py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none',
      input: 'mt-0.5 bg-b5 text-t1 border-b1 outline-none'
    })
  };
  //handlers
  const { 
    selected, 
    options, 
    handlers
  } = useFieldValidationlist({ type, values, index, set });
  return (
    <div className={map.classNames.row} style={map.styles.row}>
      <div className="flex items-center">
        <select 
          style={map.styles.method} 
          className={map.classNames.method} 
          onChange={e => handlers.method(e.target.value as ValidatorMethod)}
        >
          {Object.keys(options).filter(group => group.length > 0).map(group => (
            <optgroup key={group} label={group}>
              {Object.keys(options[group]).filter(
                name => options[group][name].enabled
              ).map(name => (
                <option key={name} value={name}>
                  {options[group][name].label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <Button 
          transparent
          danger
          onClick={handlers.remove}
          style={styles !== false ? map.styles.button: false}
          className={map.classNames.button}
        >
          &times;
        </Button>
      </div>
      {!!selected?.params.length && (
        <div>
          {selected.params.map((param, i) => param.field === 'text'
          ? (
            <Control key={i} className="mt-2">
              <FieldInput 
                {...(param.attributes || {})}
                className="outline-none dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-gray-500"
                defaultValue={values ? values[index]?.parameters[i]: undefined}
                onUpdate={value => handlers.parameters(i, value)} 
              />
            </Control>
          ) : param.field === 'number' ? (
            <Control key={i} className="mt-2">
              <FieldInput
                {...(param.attributes || {})}
                type="number" 
                className="outline-none dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-gray-500"
                defaultValue={values ? values[index]?.parameters[i]: undefined}
                onUpdate={value => handlers.parameters(i, value)} 
              />
            </Control>
          ) : param.field === 'textlist' ? (
            <Control key={i} className="mt-2">
              <FieldTextlist
                {...(param.attributes || {})}
                className="box-border w-full dark:border-b0 darK:bg-b5 dark:text-t1"
                classNames={{
                  value: 'outline-none border dark:border-b0 dark:bg-b5 dark:text-t1 dark:placeholder-gray-500',
                  button: 'border-0 dark:bg-b2'
                }}
                value={values ? values[index]?.parameters[i]: undefined}
                onUpdate={value => handlers.parameters(i, value)} 
              />
            </Control>
          ): null)}
        </div>
      )}
      <FieldInput 
        className="outline-none dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-gray-500"
        placeholder="Error Message"
        defaultValue={values ? values[index]?.message: undefined}
        onUpdate={value => handlers.message(value)} 
        required 
      />
    </div>
  );
};

const Fieldset = make<FieldValidationlistType>(Fields);

/**
 * Validationlist (Main)
 */
const FieldValidation: React.FC<FieldsetProps<FieldValidationlistType>> = (props) => {
  return (
    <Fieldset {...props} emptyValue={{ method: 'required', parameters: [], message: '' }} />
  );
}

export default FieldValidation;
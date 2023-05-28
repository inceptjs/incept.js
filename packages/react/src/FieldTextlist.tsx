//types
import type { FieldsProps, FieldsetProps, FieldTextlistType } from './types';
//react
import React from 'react';
//components
import Input from './FieldInput';
import Button from './Button';
import make from './Fieldset';
//hooks
import useTextlistFields from './useFieldTextlist';
//helpers
import { makeGroupStyles, makeGroupClasses } from './utils';

/**
 * Text Item Component 
 */
const Fields: React.FC<FieldsProps<FieldTextlistType>> = (props) => {
  const { 
    values, 
    index, 
    error,
    errorColor,
    styles,
    classNames,
    set
  } = props;
  //variables
  const map = {
    styles: makeGroupStyles(styles, {
      row: {
        display: 'flex',
        marginBottom: '4px'
      },
      button: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '2px',
        paddingBottom: '4px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '2px'
      },
      value: {
        borderColor: error ? errorColor: 'black',
        borderStyle: 'solid',
        borderWidth: '1px',
        color: error ? errorColor: 'black',
        paddingBottom: '8px',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '8px',
        width: '100%'
      }
    }),
    classNames: makeGroupClasses(classNames, {
      row: undefined,
      button: undefined,
      value: undefined
    })
  };
  //handlers
  const { handlers } = useTextlistFields({ values, index, set });

  return (
    <div className={map.classNames.row} style={map.styles.row}>
      <Input 
        style={styles !== false ? map.styles.value : false}
        className={map.classNames.value}
        defaultValue={values ? values[index]: undefined}
        onUpdate={handlers.update}
        error={error}
        required 
      />
      <Button 
        outline
        danger
        onClick={handlers.remove}
        style={styles !== false ? map.styles.button: false}
        className={map.classNames.button}
      >
        &times;
      </Button>
    </div>
  );
};

/**
 * Textlist Fieldset Component (Main)
 */
const FieldTextlist: React.FC<FieldsetProps<FieldTextlistType>> = (props) => {
  const { 
    label, 
    value, 
    error,
    errorColor,
    styles,
    classNames,
    onChange,
    ...attributes 
  } = props;

  const Fieldset = make<FieldTextlistType>(Fields);

  const map = {
    styles: makeGroupStyles(styles, {
      container: error ? {
        color: errorColor
      } : undefined,
      label: { display: 'block' },
      field: undefined,
      error: undefined
    }),
    classNames: makeGroupClasses(classNames, {
      container: undefined,
      label: undefined,
      field: undefined,
      error: undefined
    })
  };

  return (
    <div className={map.classNames.container} style={map.styles.container}>
      {label?.length && (
        <label className={map.classNames.label} style={map.styles.label}>
          {label}
        </label>
      )}
      <div className={map.classNames.field} style={map.styles.field}>
        <Fieldset 
          {...attributes}
          error={error}
          errorColor={errorColor}
          styles={styles}
          classNames={classNames}
          value={value} 
          label={label} 
          emptyValue={''}
          onChange={onChange} 
        />
      </div>
    </div>
  );
}

export default FieldTextlist;
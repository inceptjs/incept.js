//type
import type {  ExtendsType, FieldSelectProps } from 'frui';
import type { 
  FieldSchemaState, 
  FieldSchemaHandler 
} from '../hooks/useFieldSelectSchema';
//react
import React from 'react';
//components
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldSelect from 'frui/tailwind/FieldSelect';
//hooks
import useFieldSelectSchema from '../hooks/useFieldSelectSchema';

const FieldSelectSchema: React.FC<ExtendsType<FieldSelectProps, {
  options?: undefined,
  labelholder?: string,
  schemaholder?: string,
  columnholder?: string,
  defaultValue?: FieldSchemaState,
  onUpdate: FieldSchemaHandler
}>> = (props) => {
  const { 
    defaultValue, 
    labelholder = 'Enter Label', 
    schemaholder = 'Choose a Schema', 
    columnholder = 'Choose a Column',
    onUpdate,
    ...attributes 
  } = props;
  const { 
    selected, 
    schemas, 
    columns, 
    select 
  } = useFieldSelectSchema(defaultValue, onUpdate);

  const schema = schemas.find(schema => schema.value === selected.schema);
  const column = columns.find(column => column.value === selected.column);
  return (
    <div>
      <Control label="Label">
        <FieldInput 
          placeholder={labelholder} 
          className="dark:bg-b5 dark:text-t1 dark:border-b1 dark:placeholder-slate-500 outline-none"
          defaultValue={selected.label}
          onUpdate={value => select({ 
            ...selected, 
            label: value as string || ''
          })}
        />
      </Control>
      <Control label="Schema" className="relative z-1 mt-2">
        <FieldSelect 
          {...attributes} 
          placeholder={schemaholder} 
          value={schema} 
          options={schemas} 
          onUpdate={value => select({ 
            ...selected, 
            schema: value as string 
          })}
        />
      </Control>
      {schema && (
        <Control label="Column" className="relative mt-2">
          <FieldSelect 
            {...attributes} 
            placeholder={columnholder} 
            value={column} 
            options={columns} 
            onUpdate={value => select({ 
              ...selected, 
              column: value as string 
            })}
          />
        </Control>
      )}
    </div>
  );
};

export default FieldSelectSchema;
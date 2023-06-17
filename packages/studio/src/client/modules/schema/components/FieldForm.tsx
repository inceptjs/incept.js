//types
import type { SchemaColumn, FormChangeHandler } from 'inceptjs';
//hooks
import { useState, useEffect } from 'react';
import { useLanguage } from 'r22n';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
import useField from '../hooks/useField';
//components
import Button from 'frui/tailwind/Button';
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldCheckbox from 'frui/tailwind/FieldCheckbox';
import FieldSelectField from '../../common/components/FieldSelectField';
import FieldSelectFormat from '../../common/components/FieldSelectFormat';
import FieldValidationlist from '../../common/components/FieldValidationlist';
//helpers
import { slugify } from 'frui/utils';
import { api } from 'inceptjs/api';

const FieldFormInputs: React.FC<{
  data?: Partial<SchemaColumn>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  //hooks
  const { t } = useLanguage();
  //controlling unconrolled inputs :)
  const [ slug, setSlug ] = useState(data?.name || '');
  useEffect(() => change('name', slug), [ slug ]);
  //load the settings based on the chosen field
  const settings = api.field.get(data?.field?.method || '');
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      {!settings?.content?.label && (
        <Control label={`${t`Label`}*`}>
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            defaultValue={data?.label} 
            onUpdate={value => {
              change('label', value);
              setSlug(slugify(value, true, false));
            }} 
          />
        </Control>
      )}
      {!settings?.content?.name && (
        <Control label={`${t`Keyword`}*`} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            value={slug} 
            onUpdate={value => setSlug(slugify(value, true, false))} 
          />
        </Control>
      )}
      <Control label={`${t`Field`}*`} className="mt-2">
        <FieldSelectField 
          className="py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
          column={data}
          value={data?.field}
          onUpdate={change}
        />
      </Control>
      {!!settings?.validation.show && (
        <Control label={t`Validation` as string} className="mt-1">
          <FieldValidationlist 
            type={settings?.method}
            label={t`Add Validation` as string}
            value={data?.validation || []}
            className="mt-0.5 py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
            onUpdate={validation => change('validation', validation)}
          />
        </Control>
      )}
      {!!settings?.list.show && (
        <Control label={t`List` as string} className="mt-2">
          <FieldSelectFormat
            format="list"
            value={data?.list}
            field={data?.field?.method}
            className="py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
            onUpdate={change} 
          />
        </Control>
      )}
      {!!settings?.view.show && (
        <Control label={t`View` as string} className="mt-2">
          <FieldSelectFormat
            format="view"
            value={data?.view}
            field={data?.field?.method}
            className="py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
            onUpdate={change} 
          />
        </Control>
      )}
      {!!settings?.primary.show && (
        <Control className="mt-2">
          <FieldCheckbox 
            label={t`Primary` as string}
            className="bg-b5 text-t1 border-b1 outline-none"
            checked={data?.data?.primary} 
            onUpdate={value => change(['data', 'primary'], value)}
          />
        </Control>
      )}
      {!!settings?.searchable.show && (
        <Control className="mt-2">
          <FieldCheckbox 
            label={t`Searchable` as string}
            className="bg-b5 text-t1 border-b1 outline-none"
            checked={data?.searchable} 
            onUpdate={value => change('searchable', value)}
          />
        </Control>
      )}
      {!!settings?.filterable.show && (
        <Control className="mt-2">
          <FieldCheckbox 
            label={t`Filterable` as string}
            className="bg-b5 text-t1 border-b1 outline-none"
            checked={data?.filterable} 
            onUpdate={value => change('filterable', value)}
          />
        </Control>
      )}
      {!!settings?.sortable.show && (
        <Control className="mt-2">
          <FieldCheckbox 
            label={t`Sortable` as string}
            className="bg-b5 text-t1 border-b1 outline-none"
            checked={data?.sortable} 
            onUpdate={value => change('sortable', value)}
          />
        </Control>
      )}
      {!!settings?.default.show && (
        <Control label={t`Default` as string} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            defaultValue={data?.default} 
            onUpdate={value => change('default', value)} 
          />
          <div>
            <a 
              className="text-t2 cursor-pointer" 
              onClick={() => change('default', 'nanoid()')}
            >nanoid()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => change('default', 'cuid()')}
            >cuid()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => change('default', 'cuid2()')}
            >cuid2()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => change('default', 'now()')}
            >now()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => change('default', 'updated()')}
            >updated()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => change('default', 'increment()')}
            >increment()</a>
          </div>
        </Control>
      )}
    </section>
  );
};

const FieldForm: React.FC<{
  mode: 'create'|'update',
  label: string,
  defaultValue?: Partial<SchemaColumn>,
  columns: SchemaColumn[],
  onSubmit: (column: Partial<SchemaColumn>) => void
}> = ({ mode, label, defaultValue, columns, onSubmit }) => {
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const { data, handlers } = useField(mode, onSubmit, columns, defaultValue);
  //render
  return (
    <form className="flex flex-col text-sm bg-b4 h-full" onSubmit={handlers.send}>
      <header className="flex items-center bg-b2 border-b0 border-b h-12">
        <Button transparent className="border-0 py-4 h-12" type="button" onClick={mobile.pop}>
          <i className="fas fa-fw fa-chevron-left text-t1"></i>
        </Button>
        <h1 className="font-bold uppercase">{label}</h1>
      </header>
      <FieldFormInputs data={data} change={handlers.change} />
      <footer className="bg-b2 border-b0 border-t p-2">
        <Button info className="w-full">
          <i className="fas fa-fw fa-check mr-2"></i>
          {t`Save`}
        </Button>
      </footer>
    </form>
  );
};

export default FieldForm;
//types
import type { FieldsetColumn, FormChangeHandler } from 'inceptjs';
//hooks
import { useState } from 'react';
import { useLanguage } from 'r22n';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
import useColumn from '../hooks/useColumn';
//components
import Button from 'frui/tailwind/Button';
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldSelectField from '../../common/components/FieldSelectField';
import FieldSelectFormat from '../../common/components/FieldSelectFormat';
import FieldValidationlist from '../../common/components/FieldValidationlist';
//helpers
import { api } from 'inceptjs/api';

const ColumnFormTabs: React.FC<{
  data?: Partial<FieldsetColumn>,
  tab: number,
  set: (tab: number) => void 
}> = ({ data, tab, set }) => {
  const { t } = useLanguage();
  //load the settings based on the chosen field
  const settings = api.field.get(data?.field?.method || '');
  return (
    <section className="flex bg-b5 border-b border-b0 pt-2">
      <a 
        className={`${tab === 0 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
        onClick={() => set(0)}
      >
        {t`Field`}
      </a>
      {!!settings?.display.list.show && !!settings?.display.view.show && (
        <a 
          className={`${tab === 1 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
          onClick={() => set(1)}
        >
          {t`Display`}
        </a>
      )}
    </section>
  );
};

const ColumnFormField: React.FC<{
  data: {
    input: Partial<FieldsetColumn>,
    slug: string
  },
  handlers: {
    slug: (value: string) => void,
    change: FormChangeHandler,
    send: (e: React.FormEvent<Element>) => boolean
  }
}> = ({ data, handlers }) => {
  const { t } = useLanguage();
  //load the settings based on the chosen field
  const settings = api.field.get(data.input.field?.method || '');
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      {settings?.column?.label.show && (
        <Control label={`${t`Label`}*`}>
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            defaultValue={data?.input.label} 
            onUpdate={value => {
              handlers.change('label', value);
              handlers.slug(value);
            }} 
          />
        </Control>
      )}
      {settings?.column?.name.show && (
        <Control label={`${t`Keyword`}*`} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            value={data.slug} 
            onUpdate={value => handlers.slug(value)} 
          />
        </Control>
      )}
      <Control label={`${t`Field`}*`} className="mt-2">
        <FieldSelectField 
          className="py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
          column={data.input}
          value={data.input?.field}
          onUpdate={handlers.change}
        />
      </Control>
      {!!settings?.validation.show && (
        <Control label={t`Validation` as string} className="mt-1">
          <FieldValidationlist 
            type={settings?.method}
            label={t`Add Validation` as string}
            value={data.input?.validation || []}
            className="mt-0.5 py-2 border-0 box-border w-full bg-b2 text-t1 outline-none"
            onUpdate={validation => handlers.change('validation', validation)}
          />
        </Control>
      )}
      {!!settings?.default.show && (
        <Control label={t`Default` as string} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            defaultValue={data.input?.default} 
            onUpdate={value => handlers.change('default', value)} 
          />
        </Control>
      )}
    </section>
  );
};

const ColumnFormDisplay: React.FC<{
  data?: Partial<FieldsetColumn>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  const { t } = useLanguage();
  //load the settings based on the chosen field
  const settings = api.field.get(data?.field?.method || '');
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      {settings?.display.list.show && (
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
      {settings?.display.view.show && (
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
    </section>
  );
};

const ColumnForm: React.FC<{
  mode: 'create'|'update',
  label: string,
  defaultValue?: Partial<FieldsetColumn>,
  columns: FieldsetColumn[],
  onSubmit: (column: Partial<FieldsetColumn>) => void
}> = ({ mode, label, defaultValue, columns, onSubmit }) => {
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const { data, handlers } = useColumn(
    mode, 
    onSubmit, 
    columns, 
    defaultValue
  );
  const [ tab, setTab ] = useState(0);
  //render
  return (
    <form className="flex flex-col text-sm bg-b4 h-full" onSubmit={handlers.send}>
      <header className="flex items-center bg-b2 border-b0 border-b h-12">
        <Button transparent className="border-0 py-4 h-12" type="button" onClick={mobile.pop}>
          <i className="fas fa-fw fa-chevron-left text-t1"></i>
        </Button>
        <h1 className="font-bold uppercase">{label}</h1>
      </header>
      <ColumnFormTabs data={data.input} tab={tab} set={setTab} />
      {tab === 0 && (<ColumnFormField data={data} handlers={handlers} />)}
      {tab === 1 && (<ColumnFormDisplay data={data.input} change={handlers.change} />)}
      <footer className="bg-b2 border-b0 border-t p-2">
        <Button info className="w-full">
          <i className="fas fa-fw fa-check mr-2"></i>
          {t`Save`}
        </Button>
      </footer>
    </form>
  );
};

export default ColumnForm;
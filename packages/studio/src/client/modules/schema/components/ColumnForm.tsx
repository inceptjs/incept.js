//types
import type { SchemaColumn, FormChangeHandler } from 'inceptjs';
//hooks
import { useState } from 'react';
import { useLanguage } from 'r22n';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
import useColumn from '../hooks/useColumn';
//components
import Button from 'frui/tailwind/Button';
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldCheckbox from 'frui/tailwind/FieldCheckbox';
import FieldSelectField from '../../common/components/FieldSelectField';
import FieldSelectSchema from '../../common/components/FieldSelectSchema';
import FieldSelectFormat from '../../common/components/FieldSelectFormat';
import FieldValidationlist from '../../common/components/FieldValidationlist';
//helpers
import { api } from 'inceptjs/api';

const ColumnFormTabs: React.FC<{
  data?: Partial<SchemaColumn>,
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
      <a 
        className={`${tab === 2 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
        onClick={() => set(2)}
      >
        {t`Data`}
      </a>
    </section>
  );
};

const ColumnFormField: React.FC<{
  data: {
    input: Partial<SchemaColumn>,
    slug: string,
    dataType: string,
    dataLength: number|number[],
    dataUnsigned: boolean
  },
  handlers: {
    slug: (value: string) => void,
    dataType: React.Dispatch<React.SetStateAction<string>>,
    dataLength: React.Dispatch<React.SetStateAction<number|number[]>>,
    dataUnsigned: React.Dispatch<React.SetStateAction<boolean>>,
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
            className="mt-0.5 py-2 border border-b0 box-border w-full bg-b5 text-t1 outline-none"
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
          <div>
            <a 
              className="text-t2 cursor-pointer" 
              onClick={() => handlers.change('default', 'nanoid()')}
            >nanoid()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => handlers.change('default', 'cuid()')}
            >cuid()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => handlers.change('default', 'cuid2()')}
            >cuid2()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => handlers.change('default', 'now()')}
            >now()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => handlers.change('default', 'updated()')}
            >updated()</a>
            <a 
              className="text-t2 cursor-pointer ml-2" 
              onClick={() => handlers.change('default', 'increment()')}
            >increment()</a>
          </div>
        </Control>
      )}
    </section>
  );
};

const ColumnFormDisplay: React.FC<{
  data?: Partial<SchemaColumn>,
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

      {(settings?.display.searchable.show || settings?.display.filterable.show || settings?.display.sortable.show) && (
        <Control label={t`Flags` as string} className="mt-2">
          <div className="border border-b0 bg-b3 p-4 mt-1">
          {settings?.display.searchable.show && (
            <Control>
              <FieldCheckbox 
                label={t`Searchable` as string}
                className="bg-b5 text-t1 border-b1 outline-none"
                checked={!!data?.searchable} 
                onUpdate={_ => change('searchable', !data?.searchable)}
              />
            </Control>
          )}
          {settings?.display.filterable.show && (
            <Control className="mt-2">
              <FieldCheckbox 
                label={t`Filterable` as string}
                className="bg-b5 text-t1 border-b1 outline-none"
                checked={data?.filterable} 
                onUpdate={_ => change('filterable', !data?.filterable)}
              />
            </Control>
          )}
          {settings?.display.sortable.show && (
            <Control className="mt-2">
              <FieldCheckbox 
                label={t`Sortable` as string}
                className="bg-b5 text-t1 border-b1 outline-none"
                checked={!!data?.sortable} 
                onUpdate={_ => change('sortable', !data?.sortable)}
              />
            </Control>
          )}
          </div>
        </Control>
      )}
    </section>
  );
};

const ColumnFormData: React.FC<{
  data: {
    input: Partial<SchemaColumn>,
    slug: string,
    dataType: string,
    dataLength: number | number[],
    dataUnsigned: boolean
  },
  handlers: {
    slug: (value: string) => void,
    dataType: React.Dispatch<React.SetStateAction<string>>,
    dataLength: React.Dispatch<React.SetStateAction<number|number[]>>,
    dataUnsigned: React.Dispatch<React.SetStateAction<boolean>>,
    change: FormChangeHandler,
    send: (e: React.FormEvent<Element>) => boolean
  }
}> = ({ data, handlers }) => {
  const { t } = useLanguage();
  //load the settings based on the chosen field
  const settings = api.field.get(data.input?.field?.method || '');
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      {settings?.data.type.show && (
        <Control label={`${t`Type`}*`} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            value={data.dataType} 
            onUpdate={value => handlers.dataType(value)} 
          />
        </Control>
      )}
      {settings?.data.length.show && (
        <Control label={t`Length` as string} className="mt-2">
          <FieldInput 
            className="bg-b5 text-t1 border-b1 outline-none"
            value={Array.isArray(data.dataLength) 
              ? data.dataLength.join(',') 
              : data.dataLength} 
            onUpdate={value => handlers.dataLength(value.includes(',') 
              ? value
                .split(',')
                .map(v => v.trim())
                .map(v => isNaN(Number(v)) ? 0 : Number(v))
              : Number(value) || 0)} 
          />
        </Control>
      )}
      {(settings?.data.unsigned.show || settings?.data.primary.show) && (
        <Control label={t`Flags` as string} className="mt-2">
          <div className="border border-b0 bg-b3 p-4 mt-1">
            {settings?.data.unsigned.show && (
              <Control className="relative z-1">
                <FieldCheckbox 
                  label={t`Unsigned` as string}
                  className="bg-b5 text-t1 border-b1 outline-none"
                  checked={data.dataUnsigned} 
                  onUpdate={_ => handlers.dataUnsigned(!data.dataUnsigned)}
                />
              </Control>
            )}
            {settings?.data.primary.show && (
              <Control className="mt-2 relative z-1">
                <FieldCheckbox 
                  label={t`Primary` as string}
                  className="bg-b5 text-t1 border-b1 outline-none"
                  checked={data.input?.data?.primary} 
                  onUpdate={value => handlers.change(
                    ['data', 'primary'], 
                    !data.input?.data?.primary
                  )}
                />
              </Control>
            )}
          </div>
        </Control>
      )}
      {settings?.data.relation.show && (
        <Control label={t`Related To` as string} className="relative z-2 mt-2">
          <div className="border border-b0 bg-b3 p-4 mt-1">
            <FieldSelectSchema 
              classNames={{
                control: 'dark:bg-b5 dark:text-t1 dark:border-b1',
                placeholder: 'dark:text-gray-500',
                dropdown: 'dark:bg-b3',
                option: 'dark:border-b1'
              }}
              defaultValue={data.input?.relation}
              onUpdate={value => handlers.change('relation', value)}
            />
          </div>
        </Control>
      )}
      
    </section>
  );
};

const ColumnForm: React.FC<{
  mode: 'create'|'update',
  label: string,
  defaultValue?: Partial<SchemaColumn>,
  columns: SchemaColumn[],
  onSubmit: (column: Partial<SchemaColumn>) => void
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
      {tab === 2 && (<ColumnFormData data={data} handlers={handlers} />)}
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
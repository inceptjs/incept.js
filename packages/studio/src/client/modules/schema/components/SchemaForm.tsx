//types
import type { 
  SchemaConfig, 
  SchemaColumn,
  FormHandlers, 
  FormChangeHandler 
} from 'inceptjs';
//hooks
import { useState } from 'react';
import { useLanguage } from 'r22n';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
//components
import Alert from 'frui/tailwind/Alert';
import Button from 'frui/tailwind/Button';
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldTextarea from 'frui/tailwind/FieldTextarea';
import { Table, Thead, Trow, Tcol } from 'frui//tailwind/Table';
import FieldForm from './FieldForm';
//helpers
import { getColumnDefaults } from '../../common/column';

const SchemaFormTabs: React.FC<{
  tab: number,
  set: (tab: number) => void 
}> = ({ tab, set }) => {
  const { t } = useLanguage();
  return (
    <section className="flex bg-b5 border-b border-b0 pt-2">
      <a 
        className={`${tab === 0 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
        onClick={() => set(0)}
      >
        {t`Content`}
      </a>
      <a 
        className={`${tab === 1 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
        onClick={() => set(1)}
      >
        {t`Columns`}
      </a>
      <a 
        className={`${tab === 2 ? 'text-t1 bg-b4 border border-b0 border-b-0 relative top-[1px]' : 'cursor-pointer text-t2'} ml-2 py-3 px-4`}
        onClick={() => set(2)}
      >
        {t`Relations`}
      </a>
    </section>
  );
};

const SchemaFormInputs: React.FC<{
  data: Partial<SchemaConfig>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  const { t } = useLanguage();
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      <Control label={`${t`Singular`}*`} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.singular} 
          onUpdate={value => change('singular', value)} 
        />
      </Control>
      <Control label={`${t`Plural`}*`} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.plural} 
          onUpdate={value => change('plural', value)} 
        />
      </Control>
      <Control label={`${t`Keyword`}*`} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.name} 
          onUpdate={value => change('name', value)} 
        />
      </Control>
      <Control label={t`Icon` as string} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.icon} 
          onUpdate={value => change('icon', value)} 
        />
      </Control>
      <Control label={t`Group` as string} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.group} 
          onUpdate={value => change('group', value)} 
        />
      </Control>
      <Control label={t`Description` as string} className="mt-2">
        <FieldTextarea
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.description} 
          onUpdate={value => change('description', value)} 
        />
      </Control>
    </section>
  );
};

const SchemaFormFields: React.FC<{
  data: Partial<SchemaConfig>
  onAdd: () => void
}> = ({ data, onAdd }) => {
  const { t } = useLanguage();
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      <Button info transparent className="text-center w-full" type="button" onClick={onAdd}>
        <i className="fas fa-fw fa-plus mr-2"></i>
        {t`Add Field`}
      </Button>
      <div className="flex-grow overflow-auto mt-2">
        <Table>
          <Thead className="bg-b3 w-3">&nbsp;</Thead>
          <Thead className="text-left bg-b3 text-t1 text-xs">
            {t`Name`}
          </Thead>
          <Thead className="text-left bg-b3 text-t1 text-xs">
            {t`Format`}
          </Thead>
          <Thead className="text-left bg-b3 text-t1 text-xs">
            {t`Index`}
          </Thead>
          {!data.columns?.length && (
            <Trow className="p-0 px-0 py-0">
              <Tcol colSpan={4} className="p-0 px-0 py-0">
                <Alert className="border-0 bg-b-inverse text-[#272C36] text-xs">
                  <i className="fas fa-fw fa-info-circle"></i>
                  {t`No Fields Defined`}
                </Alert>
              </Tcol>
            </Trow>
          )}
          {data.columns?.map((column, i) => (
            <Trow key={i}>
              <Tcol>
                <a className="block text-t2">{column.label}</a>
                <p>{column.label}</p>
                <div>
                  <a className="text-t2">
                    <i className="fas fa-fw fa-copy"></i>
                  </a>
                  <a className="ml-2 text-t-error">
                    <i className="fas fa-fw fa-times"></i>
                  </a>
                </div>
              </Tcol>
            </Trow>
          ))}
        </Table>
      </div>
    </section>
  );
};

const SchemaFormRelations: React.FC<{
  data: Partial<SchemaConfig>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      Relations
    </section>
  );
};

const SchemaForm: React.FC<{
  label: string,
  handlers: FormHandlers,
  data: Partial<SchemaConfig>
}> = (props) => {
  const { handlers, data, label } = props;
  const { t } = useLanguage();
  const [ tab, setTab ] = useState(0);
  const { handlers: mobile } = useMobile();
  const defaultValue = getColumnDefaults('none');
  const viewField = () => mobile.push(
    <FieldForm 
      key={Math.random()}
      label={t`Add Field` as string} 
      defaultValue={defaultValue}
      onSubmit={(column: Partial<SchemaColumn>) => {
        handlers.change('columns', [...(data.columns || []), column])
      }} 
    />
  );
  return (
    <form className="flex flex-col text-sm bg-b4 h-full" onSubmit={handlers.send}>
      <header className="flex items-center bg-b2 border-b0 border-b h-12">
        <Button transparent className="border-0 py-4 h-12" type="button" onClick={mobile.pop}>
          <i className="fas fa-fw fa-chevron-left text-t1"></i>
        </Button>
        <h1 className="font-bold uppercase">{label}</h1>
      </header>
      <SchemaFormTabs tab={tab} set={setTab} />
      {tab === 0 && (<SchemaFormInputs data={data} change={handlers.change} />)}
      {tab === 1 && (<SchemaFormFields data={data} onAdd={viewField} />)}
      {tab === 2 && (<SchemaFormRelations data={data} change={handlers.change} />)}
      <footer className="bg-b2 border-b0 border-t p-2">
        <Button info className="w-full">
          <i className="fas fa-fw fa-check mr-2"></i>
          {t`Publish`}
        </Button>
      </footer>
    </form>
  );
}

export default SchemaForm;
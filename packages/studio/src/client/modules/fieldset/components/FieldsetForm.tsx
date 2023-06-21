//types
import type { DragEvent } from 'react';
import type { 
  FieldsetConfig, 
  FieldsetColumn,
  FormChangeHandler 
} from 'inceptjs';
//hooks
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from 'r22n';
import { useStripe } from 'inceptjs';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
import { useFieldsetUpsert } from '../hooks/useFieldset';
//components
import Alert from 'frui/tailwind/Alert';
import Button from 'frui/tailwind/Button';
import Control from 'frui/tailwind/Control';
import FieldInput from 'frui/tailwind/FieldInput';
import FieldSelectIcon from '../../common/components/FieldSelectIcon';
import ColumnForm from './ColumnForm';
//helpers
import { slugify } from 'frui/utils';
import { api } from 'inceptjs/api';

const FieldsetFormTabs: React.FC<{
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
    </section>
  );
};

const FieldsetFormInputs: React.FC<{
  data: Partial<FieldsetConfig>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  const { t } = useLanguage();
  //controlling unconrolled inputs :)
  const [ slug, setSlug ] = useState(data.name || '');
  useEffect(() => change('name', slug), [ slug ]);
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      <Control label={`${t`Singular`}*`} className="mt-2">
        <FieldInput 
          className="bg-b5 text-t1 border-b1 outline-none"
          defaultValue={data.singular} 
          onUpdate={value => {
            setSlug(slugify(value, true, false));
            change('singular', value);
          }}
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
          value={slug} 
          onUpdate={value => setSlug(slugify(value, true, false))} 
        />
      </Control>
      <Control label={t`Icon` as string} className="mt-2">
        <FieldSelectIcon 
          classNames={{
            control: 'dark:bg-b5 dark:text-t1 dark:border-b1',
            placeholder: 'dark:text-gray-500',
            dropdown: 'dark:bg-b3',
            option: 'dark:border-b1',
            searchIcon: 'mt-1 dark:bg-b5 dark:text-t1 dark:border-b1',
            searchControl: 'outline-none dark:bg-b5 dark:text-t1 dark:border-b1',
          }}
          defaultValue={data.icon} 
          onUpdate={value => change('icon', value)} 
        />
      </Control>
    </section>
  );
};

const FieldsetFormFields: React.FC<{
  data: Partial<FieldsetConfig>,
  change: FormChangeHandler
}> = ({ data, change }) => {
  //hooks
  const { t } = useLanguage();
  const { handlers: mobile } = useMobile();
  const stripe = useStripe('bg-b5', 'bg-b3');
  const [ placeholder, setPlaceholder ] = useState<[ string, string ]>([ '', '' ]);
  const dragging = useRef<string>('');
  //handlers
  const handlers = {
    add: () => mobile.push(
      <ColumnForm 
        key={Math.random()}
        mode="create"
        label={t`Add Column` as string} 
        columns={data.columns || []}
        defaultValue={api.fieldset.defaults('none')}
        onSubmit={(column: Partial<FieldsetColumn>) => change(
          'columns', 
          [ ...(data.columns || []), column ]
        )} 
      />
    ),
    copy: (column: Partial<FieldsetColumn>) => mobile.push(
      <ColumnForm 
        key={Math.random()}
        mode="create"
        label={t`Copy Column` as string} 
        columns={data.columns || []}
        defaultValue={column}
        onSubmit={(column: Partial<FieldsetColumn>) => change(
          'columns', 
          [...(data.columns || []), column]
        )} 
      />
    ),
    drag: (e: DragEvent<HTMLTableRowElement>, i: number) => {
      e.dataTransfer.setData('index', String(i));
      dragging.current = String(i);
    },
    over: (e: DragEvent<HTMLTableSectionElement>) => {
      //if (e.dataTransfer.getData('index') !== e.target.getAttribute('data-id'))
      e.preventDefault();
      const from = dragging.current;
      //get target and cast as an HTML Element
      let target = e.target as HTMLElement;
      //keep going up the DOM until we find a data-id
      while (!target.getAttribute('data-id') && target.parentElement) {
        target = target.parentElement;
      }
      //if we didn't find a data-id, return false
      if (!target.getAttribute('data-id')) return false;
      const to = target.getAttribute('data-id');
      //if the index is the same, return false
      if (from === to) return false;
      const position = e.clientY;
      const dimensions = target.getBoundingClientRect();
      const boundaries = [
        dimensions.top,
        dimensions.top + dimensions.height / 2,
        dimensions.top + dimensions.height
      ];
      //if the position is outside the boundaries, reset
      if (position < boundaries[0] || position > boundaries[2]) {
        setPlaceholder([ '', '']);
      } else if (position < boundaries[1]) {
        setPlaceholder([ to || '', 'top' ]);
      } else {
        setPlaceholder([ to || '', 'bottom' ]);
      }
    },
    sort: (e: DragEvent<HTMLTableSectionElement>) => {
      e.preventDefault();
      //reset everything
      dragging.current = '';
      setPlaceholder([ '', '' ]);
      //get the dragging index
      const from = parseInt(e.dataTransfer.getData('index'));
      //if from is not a number, return false
      if (isNaN(from)) return false;
      //get the drop index
      let to = parseInt(placeholder[0]);
      //if to is not a number, return false
      if (isNaN(to)) return false;
      //if adding under the destination, add 1
      if (placeholder[1] === 'bottom') {
        to += 1;
      }
      //move the item
      const update = [ ...(data.columns || []) ];
      const item = update.splice(from, 1)[0];
      update.splice(to, 0, item);
      change('columns', update);
    },
    update: (index: number, column: Partial<FieldsetColumn>) => {
      mobile.push(
        <ColumnForm 
          key={Math.random()}
          mode="update"
          label={t`Update Column` as string} 
          columns={data.columns || []}
          defaultValue={column}
          onSubmit={(column: Partial<FieldsetColumn>) => {
            const update = [ ...(data.columns || []) ];
            update.splice(index, 1, column as FieldsetColumn);
            change('columns', update);
          }} 
        />
      )
    },
    remove: (i: number) => {
      const update = [ ...(data.columns || []) ];
      update.splice(i, 1);
      change('columns', update);
    }
  };
  //render
  return (
    <section className="m-0 p-2 flex-grow overflow-y-auto">
      <Button 
        info 
        transparent 
        className="text-center w-full" 
        type="button" 
        onClick={handlers.add}
      >
        <i className="fas fa-fw fa-plus mr-2"></i>
        {t`Add Column`}
      </Button>
      <div className="flex-grow overflow-auto mt-2">
        <table className="border-spacing-0 w-full">
          <thead>
            <tr>
              <th className="p-2 border-t border-black bg-b1 w-3">&nbsp;</th>
              <th className="p-2 border-t border-black text-left bg-b1 text-t1 text-xs">
                {t`Name`}
              </th>
              <th className="p-2 border-t border-black text-left bg-b1 text-t1 text-xs">
                {t`Format`}
              </th>  
            </tr>
          </thead>
          <tbody onDrop={handlers.sort} onDragOver={handlers.over}>
            {!data.columns?.length && (
              <tr>
                <td colSpan={4} className="p-0 px-0 py-0">
                  <Alert className="border-0 bg-b-inverse text-[#272C36] text-xs">
                    <i className="fas fa-fw fa-info-circle"></i>
                    {t`No Columns Defined`}
                  </Alert>
                </td>
              </tr>
            )}
            {data.columns?.map((column, i) => (
              <tr 
                key={i} 
                data-id={i} 
                draggable="true" 
                className={placeholder[0] === String(i) && placeholder[1] === 'top'
                  ? 'border-t-8 border-gray-500' 
                  : placeholder[0] === String(i) && placeholder[1] === 'bottom'
                  ? 'border-b-8 border-gray-500'
                  : ''
                }
                onDragStart={e => handlers.drag(e, i)}
              >
                <td className={`p-4 border-t cursor-pointer text-sm border-black text-t1 ${stripe(i)}`}>
                  <i className="fas fa-arrows-alt-v mt-2 inline-block" />
                </td>
                <td className={`p-4 border-t text-sm border-black ${stripe(i)}`}>
                  <a className="block text-t2 cursor-pointer" onClick={() => handlers.update(i, column)}>
                    {column.label}
                  </a>
                  <p className="text-t1 py-1">{column.name}</p>
                  <div className="cursor-pointer">
                    <a className="text-t2" onClick={() => handlers.copy(column)}>
                      <i className="fas fa-fw fa-copy"></i>
                    </a>
                    <a className="ml-1 text-t-error" onClick={() => handlers.remove(i)}>
                      <i className="fas fa-fw fa-times"></i>
                    </a>
                  </div>
                </td>
                <td className={`p-4 border-t text-sm border-black ${stripe(i)}`}>
                  <table className="text-t1 text-sm">
                    <tbody>
                      <tr>
                        <td className="font-semibold pr-2">{t`Field`}</td>
                        <td>{column.field.method}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-2">{t`List`}</td>
                        <td>{column.list.method}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-2">{t`View`}</td>
                        <td>{column.view.method}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const FieldsetForm: React.FC<{
  label: string, 
  name?: string,
  redirect?: () => void
}> = (props) => {
  const { name, label, redirect } = props;
  //hooks
  const { t } = useLanguage();
  const { data, handlers, mobile } = useFieldsetUpsert(name, redirect);
  const [ tab, setTab ] = useState(0);
  return (
    <form className="flex flex-col text-sm bg-b4 h-full" onSubmit={handlers.send}>
      <header className="flex items-center bg-b2 border-b0 border-b h-12">
        <Button transparent className="border-0 py-4 h-12" type="button" onClick={mobile.pop}>
          <i className="fas fa-fw fa-chevron-left text-t1"></i>
        </Button>
        <h1 className="font-bold uppercase">{label}</h1>
      </header>
      <FieldsetFormTabs tab={tab} set={setTab} />
      {tab === 0 && (<FieldsetFormInputs data={data} change={handlers.change} />)}
      {tab === 1 && (<FieldsetFormFields data={data} change={handlers.change} />)}
      <footer className="bg-b2 border-b0 border-t p-2">
        <Button info className="w-full">
          <i className="fas fa-fw fa-check mr-2"></i>
          {t`Publish`}
        </Button>
      </footer>
    </form>
  );
}

export default FieldsetForm;
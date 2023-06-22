//types
import type { SchemaConfig } from 'inceptjs';
import type { Crumb } from '../../common/components/types';
//hooks
import { useLanguage } from 'r22n';
import { useStripe } from 'inceptjs';
import { useSchemaSearch } from '../hooks/useSchema';
//components
import Alert from 'frui/tailwind/Alert';
import Button from 'frui/tailwind/Button';
import Loader from 'frui/tailwind/Loader';
import { Table, Thead, Trow, Tcol, Tgroup } from 'frui//tailwind/Table';
import Crumbs from '../../common/components/Crumbs';
import SchemaForm from '../components/SchemaForm';

const SchemaSearchPage = () => {
  //hooks
  const { t } = useLanguage();
  const stripe = useStripe('bg-b4', 'bg-b5');
  const search = useSchemaSearch();
  
  const viewCreate = () => search.mobile.push(
    <SchemaForm 
      key={'CreateSchemaForm'}
      label={t`Create Schema` as string} 
      redirect={search.redirect}
    />
  );
  const viewUpdate = (name: string) => search.mobile.push(
    <SchemaForm 
      key={'UpdateSchemaForm'}
      name={name}
      label={t`Update Schema` as string} 
      redirect={search.redirect}
    />
  );
  //variables
  const crumbs: Crumb[] = [{ icon: 'database', label: t`Schemas` }];
  //render
  if (!search.response?.results) {
    return (<Loader />);
  }
  //reorganize schemas by groups
  const groups: Record<string, SchemaConfig[]> = {};
  Object.values(search.response.results).map(schema => {
    const group = schema.group || 'Unsorted';
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(schema);
  });
  //sort groups
  const sorted = Object.keys(groups).sort().reduce(
    (groups: Record<string, SchemaConfig[]>, key) => { 
      groups[key] = groups[key]; 
      return groups;
    }, {}
  );
  //move unsorted to the end
  if (sorted['Unsorted']) {
    const unsorted = sorted['Unsorted'];
    delete sorted['Unsorted'];
    sorted['Unsorted'] = unsorted;
  }
  //render
  return (
    <main className="flex flex-col">
      <div className="bg-b2 px-1 py-1 text-sm">
        <Crumbs crumbs={crumbs} />
      </div>
      <div className="p-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase flex-grow">
          {t`${Object.keys(search.response.results).length} Schemas`}
        </h1>
        <div className="hidden sm:block">
          <i className="fas fa-cloud-upload-alt"></i>
          <span className="ml-1">{t`Import`}</span>
        </div>
        <div className="ml-4 hidden sm:block">
          <i className="fas fa-cloud-download-alt"></i>
          <span className="ml-1">{t`Export`}</span>
        </div>
        <div className="ml-4">
          <Button color="#F43980" transparent type="button" onClick={viewCreate}>
            <i className="fas fa-fw fa-plus"></i>
            <span className="ml-1 hidden sm:inline-block">{t`Add Schema`}</span>
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        {Object.keys(sorted).length === 0 && (
          <div className="p-4">
            <Alert info className="mt-4">
              {t`No schemas found.`}
            </Alert>
          </div>
        )}
        {Object.keys(sorted).length > 0 && (
          <Table>
            <Thead className="bg-b3 w-3" />
            <Thead className="py-4 text-sm font-semibold text-left bg-b3 text-t1 w-full">
              {t`Schema`}
            </Thead>
            <Thead className="py-4 text-sm font-semibold text-left bg-b3 text-t1">
              {t`Relations`}
            </Thead>
            {Object.keys(sorted).map((name, i) => (
              <Tgroup key={i}>
                <Trow>
                  <Tcol className="bg-b2 text-t1">
                    <i className="fas fa-fw fa-caret-down mr-1 mt-[-1px]"></i>
                  </Tcol>
                  <Tcol wrap-4 colSpan={2} className="text-xs text-left text-t1 font-semibold bg-b2 uppercase">
                    {name}
                  </Tcol>
                </Trow>
                {groups[name].map((config, j) => {
                  const schema = new search.Schema(config.name);
                  return (
                    <Trow key={`${i}-${j}`}>
                      <Tcol className={`py-4 ${stripe(j)}`} />
                      <Tcol className={`py-4 text-left text-sm text-t1 ${stripe(j)}`}>
                        <a onClick={() => viewUpdate(config.name)} className="text-t2 cursor-pointer">
                          <i className={`fas fa-fw fa-${schema.icon}`} />
                          <span className="ml-2">{schema.singular}</span>
                        </a>
                        <p className="mt-1">{schema.description}</p>
                      </Tcol>
                      <Tcol className={`py-4 pr-4 text-left text-sm text-t1 whitespace-nowrap ${stripe(j)}`}>
                        {Object.values(schema.relations).map((relation, j) => {
                          const required = !!schema.column(relation.from)?.data.required;
                          return (
                            <div key={`${i}-${j}`} className="mb-3">
                              <div className="ml-1 font-semibold">
                                {relation.label}
                              </div>
                              <div className="mt-1">
                                <span className="ml-1">
                                  {relation.from}{!required ? '?' : ''}
                                </span>
                                <i className="fas fa-fw fa-arrow-right ml-1"></i>
                                <span className="ml-1">
                                  {relation.schema}
                                  ({relation.to})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </Tcol>
                    </Trow>
                  );
                })}
              </Tgroup>
            ))}
          </Table>
        )}
      </div>
    </main>
  );
}

export default SchemaSearchPage;
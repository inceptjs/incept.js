//types
import type { SchemaConfig } from 'inceptjs';
import type { Crumb } from '../../common/components/types';
//hooks
import { useLanguage } from 'r22n';
import { useStripe } from 'inceptjs';
import useMobile from '../../app/layouts/panel/hooks/useMobile';
import { useSchemaSearch } from '../hooks/useSchema';
//components
import { Link } from 'react-router-dom';
import Button from 'frui/tailwind/Button';
import Loader from 'frui/tailwind/Loader';
import { Table, Thead, Trow, Tcol, Tgroup } from 'frui//tailwind/Table';
import Crumbs from '../../common/components/Crumbs';
import SchemaForm from '../components/SchemaForm';

const SchemaSearchPage = () => {
  //hooks
  const { t } = useLanguage();
  const { handlers } = useMobile();
  const stripe = useStripe('bg-b4', 'bg-b5');
  const search = useSchemaSearch();
  const viewCreate = () => handlers.push(
    <SchemaForm 
      key={'SchemaForm'}
      label={t`Create Schema` as string} 
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
    if (!groups[schema.group]) {
      groups[schema.group] = []
    }
    groups[schema.group].push(schema);
  });
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
        <Table>
          <Thead className="bg-b3 w-3">&nbsp;</Thead>
          <Thead className="py-4 text-sm font-semibold text-left bg-b3 text-t1 w-full">
            {t`Schema`}
          </Thead>
          <Thead className="py-4 text-sm font-semibold text-left bg-b3 text-t1">
            {t`Relations`}
          </Thead>
          {Object.keys(groups).map((name, i) => {
            if (!name.length) {
              return groups[name].map((config, j) => {
                const schema = new search.Schema(config.name);
                return (
                  <Trow key={`${i}-${j}`}>
                    <Tcol className={`py-4 ${stripe(j)}`}>&nbsp;</Tcol>
                    <Tcol className={`py-4 text-left text-sm text-t1 ${stripe(j)}`}>
                      <Link to={`/schema/${schema.name}`} className="text-t2">
                        <i className={`fas fa-fw fa-${schema.icon}`} />
                        <span className="ml-2">{schema.singular}</span>
                      </Link>
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
              })
            }
            return (
              <Tgroup key={i}>
                <Trow>
                  <Tcol className="bg-b2 text-t1">
                    <i className="fas fa-fw fa-caret-down mr-1 mt-[1px]"></i>
                  </Tcol>
                  <Tcol wrap-4 colSpan={2} className="text-left font-bold bg-b2 text-t1 uppercase">
                    {name}
                  </Tcol>
                </Trow>
                {groups[name].map((config, j) => {
                const schema = new search.Schema(config.name);
                return (
                  <Trow key={`${i}-${j}`}>
                    <Tcol className={`py-4 ${stripe(j)}`}>&nbsp;</Tcol>
                    <Tcol className={`py-4 text-left text-sm text-t1 ${stripe(j)}`}>
                      <Link to={`/schema/${schema.name}`} className="text-t2">
                        <i className={`fas fa-fw fa-${schema.icon}`} />
                        <span className="ml-2">{schema.singular}</span>
                      </Link>
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
            );
          })}
        </Table>
      </div>
    </main>
  );
}

export default SchemaSearchPage;
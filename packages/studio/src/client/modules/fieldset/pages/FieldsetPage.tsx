//types
import type { Crumb } from '../../common/components/types';
//hooks
import { useLanguage } from 'r22n';
import { useStripe } from 'inceptjs';
import { useFieldsetSearch } from '../hooks/useFieldset';
//components
import Button from 'frui/tailwind/Button';
import Loader from 'frui/tailwind/Loader';
import { Table, Thead, Trow, Tcol } from 'frui//tailwind/Table';
import Crumbs from '../../common/components/Crumbs';
import FieldsetForm from '../components/FieldsetForm';

const FieldsetSearchPage = () => {
  //hooks
  const { t } = useLanguage();
  const stripe = useStripe('bg-b4', 'bg-b5');
  const search = useFieldsetSearch();
  
  const viewCreate = () => search.mobile.push(
    <FieldsetForm 
      key={'CreateFieldsetForm'}
      label={t`Create Fieldset` as string} 
      redirect={search.redirect}
    />
  );
  const viewUpdate = (name: string) => search.mobile.push(
    <FieldsetForm 
      key={'UpdateFieldsetForm'}
      name={name}
      label={t`Update Fieldset` as string} 
      redirect={search.redirect}
    />
  );
  //variables
  const crumbs: Crumb[] = [{ icon: 'database', label: t`Fieldsets` }];
  //render
  if (!search.response?.results) {
    return (<Loader />);
  }
  //render
  return (
    <main className="flex flex-col">
      <div className="bg-b2 px-1 py-1 text-sm">
        <Crumbs crumbs={crumbs} />
      </div>
      <div className="p-4 flex items-center">
        <h1 className="text-2xl font-semibold uppercase flex-grow">
          {t`${Object.keys(search.response.results).length} Fieldsetss`}
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
            <span className="ml-1 hidden sm:inline-block">{t`Add Fieldset`}</span>
          </Button>
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Table>
          <Thead className="py-4 text-sm font-semibold text-left bg-b3 text-t1 w-full">
            {t`Fieldset`}
          </Thead>
          {Object.keys(search.response?.results).map((name, i) => {
            const fieldset = new search.Fieldset(name);
            return (
              <Trow key={i}>
                <Tcol className={`py-4 text-left text-sm text-t1 ${stripe(i)}`}>
                  <a onClick={() => viewUpdate(name)} className="text-t2 cursor-pointer">
                    <i className={`fas fa-fw fa-${fieldset.icon}`} />
                    <span className="ml-2">{fieldset.singular}</span>
                  </a>
                </Tcol>
              </Trow>
            );
          })}
        </Table>
      </div>
    </main>
  );
}

export default FieldsetSearchPage;
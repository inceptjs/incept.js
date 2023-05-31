//types
import type { Project, Directory } from 'ts-morph';
import type { SchemaConfig } from 'inceptjs/dist/types';
//helpers
import { capitalize, getTypeName, getTypeExtendedName } from './utils';

export default function generateIndex(
  project: Project|Directory, 
  schemas: Record<string, SchemaConfig>
) {
  const path = `index.ts`;
  const source = project.createSourceFile(path, '', { overwrite: true });
  Object.keys(schemas).forEach((name) => {
    const capital = capitalize(name);
    //import ModelDefaultFilters from './[model]/components/DefaultFilters'
    source.addImportDeclaration({
      defaultImport: `${capital}DefaultFilters`,
      moduleSpecifier: `./${name}/components/DefaultFilters`
    });
    //import ModelDefaultForm from './[model]/components/DefaultForm'
    source.addImportDeclaration({
      defaultImport: `${capital}DefaultForm`,
      moduleSpecifier: `./${name}/components/DefaultForm`
    });
    //import ModelDefaultTable from './[model]/components/DefaultTable'
    source.addImportDeclaration({
      defaultImport: `${capital}DefaultTable`,
      moduleSpecifier: `./${name}/components/DefaultTable`
    });
    //import ModelDefaultView from './[model]/components/DefaultView'
    source.addImportDeclaration({
      defaultImport: `${capital}DefaultView`,
      moduleSpecifier: `./${name}/components/DefaultView`
    });
    //import ModelFilterFields from './[model]/components/FilterFields'
    source.addImportDeclaration({
      defaultImport: `${capital}FilterFields`,
      moduleSpecifier: `./${name}/components/FilterFields`
    });
    //import ModelFormFields from './[model]/components/FormFields'
    source.addImportDeclaration({
      defaultImport: `${capital}FormFields`,
      moduleSpecifier: `./${name}/components/FormFields`
    });
    //import ModelListFormats from './[model]/components/ListFormats'
    source.addImportDeclaration({
      defaultImport: `${capital}ListFormats`,
      moduleSpecifier: `./${name}/components/ListFormats`
    });
    //import ModelViewFormats from './[model]/components/ViewFormats'
    source.addImportDeclaration({
      defaultImport: `${capital}ViewFormats`,
      moduleSpecifier: `./${name}/components/ViewFormats`
    });
    //import useModelCreate from './[model]/hooks/useCreate'
    source.addImportDeclaration({
      defaultImport: `use${capital}Create`,
      moduleSpecifier: `./${name}/hooks/useCreate`
    });
    //import useModelRemove from './[model]/hooks/useRemove'
    source.addImportDeclaration({
      defaultImport: `use${capital}Remove`,
      moduleSpecifier: `./${name}/hooks/useRemove`
    });
    //import useModelUpdate from './[model]/hooks/useUpdate'
    source.addImportDeclaration({
      defaultImport: `use${capital}Update`,
      moduleSpecifier: `./${name}/hooks/useUpdate`
    });
    //import useModelSearch from './[model]/hooks/useSearch'
    source.addImportDeclaration({
      defaultImport: `use${capital}Search`,
      moduleSpecifier: `./${name}/hooks/useSearch`
    });
    //import useModelDetail from './[model]/hooks/useDetail'
    source.addImportDeclaration({
      defaultImport: `use${capital}Detail`,
      moduleSpecifier: `./${name}/hooks/useDetail`
    });
    //import validateUser from './[model]/validate'
    source.addImportDeclaration({
      defaultImport: `validate${capital}`,
      moduleSpecifier: `./${name}/validate`
    });
  });
  Object.keys(schemas).forEach((name) => {
    const capital = capitalize(name);
    const typeName = getTypeName(schemas[name]);
    const typeExtendedName = getTypeExtendedName(schemas[name]);
    //export type { ModelType, ModelTypeExtended, ModelFormResponse, 
    //ModelSearchResponse, ModelDetailResponse } from './[model]/types'
    source.addExportDeclaration({
      namedExports: [
        typeName,
        typeName !== typeExtendedName ? typeExtendedName : '',
        `${capital}FormResponse`,
        `${capital}SearchResponse`,
        `${capital}DetailResponse`
      ].filter(name => name.length > 0),
      moduleSpecifier: `./${name}/types`,
      isTypeOnly: true
    });
  });
  //export {}
  source.addExportDeclaration({
    namedExports: Object.keys(schemas).map((name) => [
      `${capitalize(name)}DefaultFilters`,
      `${capitalize(name)}DefaultForm`,
      `${capitalize(name)}DefaultTable`,
      `${capitalize(name)}DefaultView`,
      `${capitalize(name)}FilterFields`,
      `${capitalize(name)}FormFields`,
      `${capitalize(name)}ListFormats`,
      `${capitalize(name)}ViewFormats`,
      `use${capitalize(name)}Create`,
      `use${capitalize(name)}Remove`,
      `use${capitalize(name)}Update`,
      `use${capitalize(name)}Search`,
      `use${capitalize(name)}Detail`,
      `validate${capitalize(name)}`
    ]).flat(1)
  });
};
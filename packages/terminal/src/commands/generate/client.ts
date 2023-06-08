//types
import type { SchemaConfig } from 'inceptjs';
//helpers
import fs from 'fs';
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Loader from '../../types/Loader';
//generators
import generateIndex from '../../generators/client/index';
import generateTypes from '../../generators/client/types';
import generateValidate from '../../generators/client/validate';

import generateUseCreate from '../../generators/client/hooks/useCreate';
import generateUseRemove from '../../generators/client/hooks/useRemove';
import generateUseUpdate from '../../generators/client/hooks/useUpdate';
import generateUseSearch from '../../generators/client/hooks/useSearch';
import generateUseDetail from '../../generators/client/hooks/useDetail';

import generateReactDefaultFilters from '../../generators/client/components/react/DefaultFilters';
import generateReactDefaultForm from '../../generators/client/components/react/DefaultForm';
import generatereactDefaultTable from '../../generators/client/components/react/DefaultTable';
import generateReactDefaultView from '../../generators/client/components/react/DefaultView';

import generateTailwindDefaultFilters from '../../generators/client/components/tailwind/DefaultFilters';
import generateTailwindDefaultForm from '../../generators/client/components/tailwind/DefaultForm';
import generateTailwindDefaultTable from '../../generators/client/components/tailwind/DefaultTable';
import generateTailwindDefaultView from '../../generators/client/components/tailwind/DefaultView';

import generateFilterFields from '../../generators/client/components/FilterFields';
import generateFormFields from '../../generators/client/components/FormFields';
import generateListFormats from '../../generators/client/components/ListFormats';
import generateViewFormats from '../../generators/client/components/ViewFormats';

export default function generate(root: string, ts = false, ui = 'react') {
  //get all json files in the schema directory (defined in config.schema)
  const folder = Loader.schemas();
  //read all files in the schema folder
  const files = fs.readdirSync(folder).filter(
    file => file.endsWith('.js') || file.endsWith('.json')
  );
  const schemas: Record<string, SchemaConfig> = {};
  //parse each file as json
  files.forEach(file => {
    if (fs.lstatSync(path.join(folder, file)).isDirectory()) {
      return;
    }
    const schema = require(path.join(folder, file.split('.')[0]));
    if (typeof schema !== 'object') {
      console.error(`Schema "${file}" is not valid JSON`);
      return;
    }
    schemas[schema.name] = schema;
  });
  
  //if root exists
  if (fs.existsSync(root)) {
    //remove root folder
    fs.rmSync(root, { recursive: true });
  }
  //remake root folder
  fs.mkdirSync(root, { recursive: true });
  
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../../tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: root,
      declaration: true, // Generates corresponding '.d.ts' file.
      declarationMap: true, // Generates a sourcemap for each corresponding '.d.ts' file.
      sourceMap: true, // Generates corresponding '.map' file.
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });

  const directory = project.createDirectory(root);
  generateIndex(directory, schemas);
  for (const name in schemas) {
    generateTypes(directory, schemas[name], schemas);
    generateValidate(directory, schemas[name]);

    generateUseCreate(directory, schemas[name]);
    generateUseRemove(directory, schemas[name]);
    generateUseUpdate(directory, schemas[name]);
    generateUseSearch(directory, schemas[name]);
    generateUseDetail(directory, schemas[name]);

    generateFilterFields(directory, schemas[name], ui);
    generateFormFields(directory, schemas[name], ui);
    generateListFormats(directory, schemas[name], ui);
    generateViewFormats(directory, schemas[name], ui);

    if (ui === 'tailwind') {
      generateTailwindDefaultFilters(directory, schemas[name]);
      generateTailwindDefaultForm(directory, schemas[name]);
      generateTailwindDefaultTable(directory, schemas[name]);
      generateTailwindDefaultView(directory, schemas[name]);
    } else {
      generateReactDefaultFilters(directory, schemas[name]);
      generateReactDefaultForm(directory, schemas[name]);
      generatereactDefaultTable(directory, schemas[name]);
      generateReactDefaultView(directory, schemas[name]);
    }
  }

  //if you want ts, tsx files
  if (ts) {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}
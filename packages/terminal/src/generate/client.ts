//types
import type { SchemaConfig } from 'inceptjs/dist/types';
//generators
import generateIndex from '@inceptjs/generator/dist/index';
import generateTypes from '@inceptjs/generator/dist/types';
import generateValidate from '@inceptjs/generator/dist/validate';

import generateUseCreate from '@inceptjs/generator/dist/hooks/useCreate';
import generateUseRemove from '@inceptjs/generator/dist/hooks/useRemove';
import generateUseUpdate from '@inceptjs/generator/dist/hooks/useUpdate';
import generateUseSearch from '@inceptjs/generator/dist/hooks/useSearch';
import generateUseDetail from '@inceptjs/generator/dist/hooks/useDetail';

import generateReactDefaultFilters from '@inceptjs/generator/dist/components/react/DefaultFilters';
import generateReactDefaultForm from '@inceptjs/generator/dist/components/react/DefaultForm';
import generatereactDefaultTable from '@inceptjs/generator/dist/components/react/DefaultTable';
import generateReactDefaultView from '@inceptjs/generator/dist/components/react/DefaultView';

import generateTailwindDefaultFilters from '@inceptjs/generator/dist/components/tailwind/DefaultFilters';
import generateTailwindDefaultForm from '@inceptjs/generator/dist/components/tailwind/DefaultForm';
import generateTailwindDefaultTable from '@inceptjs/generator/dist/components/tailwind/DefaultTable';
import generateTailwindDefaultView from '@inceptjs/generator/dist/components/tailwind/DefaultView';

import generateFilterFields from '@inceptjs/generator/dist/components/FilterFields';
import generateFormFields from '@inceptjs/generator/dist/components/FormFields';
import generateListFormats from '@inceptjs/generator/dist/components/ListFormats';
import generateViewFormats from '@inceptjs/generator/dist/components/ViewFormats';

//helpers
import fs from 'fs';
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import { getConfig, getSchemaFolder, findNodeModules } from 'inceptjs/dist/server/utils';

const cwd = process.cwd();

export default function generate(ui = 'react') {
  //get config
  const config = getConfig(cwd);
  if (!config) {
    console.error('No config found');
    return;
  }
  //get all json files in the schema directory (defined in config.schema)
  const folder = getSchemaFolder(cwd);
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
  const modules = findNodeModules(cwd);
  if (!modules) {
    throw new Error('Could not find node_modules folder');
  }
  const client = `${modules}/.incept/client`;
  //if client exists
  if (fs.existsSync(client)) {
    //remove client folder
    fs.rmSync(client, { recursive: true });
  }
  //remake client folder
  fs.mkdirSync(client, { recursive: true });
  
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      outDir: client,
      declaration: true, // Generates corresponding '.d.ts' file.
      declarationMap: true, // Generates a sourcemap for each corresponding '.d.ts' file.
      sourceMap: true, // Generates corresponding '.map' file.
    },
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces
    }
  });

  const directory = project.createDirectory(client);
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
  
  //if you want js, d.ts files
  project.emit();
  //if you want ts, tsx files
  //project.saveSync();
}
//types
import type { Framework } from 'inceptjs';
import type { SchemaConfig } from 'inceptjs';
//helpers
import fs from 'fs';
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Loader from '../types/Loader';
//server generators
import generateServerIndex from '../generators/server/index';
import generateServerValidate from '../generators/server/schemas/validate';
import generateServerTypes from '../generators/server/schemas/types';
import generateApp from '../generators/server/app';
import generateBootSchema from '../generators/server/loaders/schema';
import generateBootError from '../generators/server/loaders/error';
import generateBootObject from '../generators/server/loaders/object';
import generateBootCollection from '../generators/server/loaders/collection';
import generateModelRoutes from '../generators/server/schemas/routes';
//client generators
import generateClientIndex from '../generators/client/index';
import generateClientValidate from '../generators/client/validate';
import generateClientTypes from '../generators/client/types';
import generateUseCreate from '../generators/client/hooks/useCreate';
import generateUseRemove from '../generators/client/hooks/useRemove';
import generateUseUpdate from '../generators/client/hooks/useUpdate';
import generateUseSearch from '../generators/client/hooks/useSearch';
import generateUseDetail from '../generators/client/hooks/useDetail';
import generateReactDefaultFilters from '../generators/client/components/react/DefaultFilters';
import generateReactDefaultForm from '../generators/client/components/react/DefaultForm';
import generatereactDefaultTable from '../generators/client/components/react/DefaultTable';
import generateReactDefaultView from '../generators/client/components/react/DefaultView';
import generateTailwindDefaultFilters from '../generators/client/components/tailwind/DefaultFilters';
import generateTailwindDefaultForm from '../generators/client/components/tailwind/DefaultForm';
import generateTailwindDefaultTable from '../generators/client/components/tailwind/DefaultTable';
import generateTailwindDefaultView from '../generators/client/components/tailwind/DefaultView';
import generateFilterFields from '../generators/client/components/FilterFields';
import generateFormFields from '../generators/client/components/FormFields';
import generateListFormats from '../generators/client/components/ListFormats';
import generateViewFormats from '../generators/client/components/ViewFormats';

export default function boot(ctx: Framework) {
  ctx.on('generate', (req, res) => {
    const modules = `${Loader.modules()}/.incept`;
    const ts = !!req.params.ts || !!req.params.t || false;
    const location = Loader.absolute(
      (req.params.location || req.params.l || modules) as string
    );
    const platform = req.params.platform || req.params.p || 'all';
    const ui = (req.params.ui || req.params.u || 'react') as string;

    if (platform === 'server' || platform === 'all') {
      console.log('Generating server...');
      if (ts) {
        if (location === modules) {
          server(`${location}/ts-server`, ts);
        } else {
          server(`${location}/server`, ts);
        }
      } else {
        server(`${location}/server`, ts);
      }
      
      console.log('Done!');
    }
    if (platform === 'client' || platform === 'all') {
      console.log('Generating client...');
      if (ts) {
        if (location === modules) {
          client(`${location}/ts-client`, ts, ui);
        } else {
          client(`${location}/client`, ts, ui);
        }
      } else {
        client(`${location}/client`, ts, ui);
      }
      console.log('Done!');
    }

    req.stage('ts', ts);
    req.stage('ui', ui);
    req.stage('location', location);
    req.stage('platform', platform);
    
    res.json({ error: false });
  }, 10);
};

function server(root: string, ts = false) {
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
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
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
  
  //get config incept.config.js and move to root folder
  const config = Loader.config();
  fs.writeFileSync(
    `${root}/config.json`, 
    JSON.stringify(config, null, 2)
  );

  const directory = project.createDirectory(root);
  const plugins = Loader.plugins(root, config.plugins || []);
  generateServerIndex(directory, schemas);
  generateApp(directory, plugins, schemas);
  generateBootSchema(directory, schemas);
  generateBootError(directory);
  generateBootObject(directory);
  generateBootCollection(directory);
  for (const name in schemas) {
    generateModelRoutes(directory, schemas[name]);
    generateServerTypes(directory, schemas[name], schemas);
    generateServerValidate(directory, schemas[name]);
  }

  //move schema files to schemas/[name]
  Object.keys(schemas).forEach(name => {
    const schema = schemas[name];
    //make schema folder if it doesn't exist
    if (!fs.existsSync(`${root}/schemas/${name}`)) {
      fs.mkdirSync(`${root}/schemas/${name}`, { recursive: true });
    }
    fs.writeFileSync(
      `${root}/schemas/${name}/schema.json`, 
      JSON.stringify(schema, null, 2)
    );
  });
  
  //if you want ts, tsx files
  if (ts) {
    project.saveSync();
  //if you want js, d.ts files
  } else {
    project.emit();
  }
}

function client(root: string, ts = false, ui = 'react') {
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
    tsConfigFilePath: path.resolve(__dirname, '../../tsconfig.json'),
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
  generateClientIndex(directory, schemas);
  for (const name in schemas) {
    generateClientTypes(directory, schemas[name], schemas);
    generateClientValidate(directory, schemas[name]);

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
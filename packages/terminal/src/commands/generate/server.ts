//types
import type { SchemaConfig } from 'inceptjs';
//helpers
import fs from 'fs';
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Loader from '../../types/Loader';
//generators
import generateIndex from '../../generators/server/index';
import generateValidate from '../../generators/server/schemas/validate';
import generateTypes from '../../generators/server/schemas/types';
import generateApp from '../../generators/server/app';
import generateBootSchema from '../../generators/server/loaders/schema';
import generateBootError from '../../generators/server/loaders/error';
import generateBootObject from '../../generators/server/loaders/object';
import generateBootCollection from '../../generators/server/loaders/collection';
import generateBootRoutes from '../../generators/server/loaders/routes';

export default function generate(root: string, ts = false) {
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
  
  //get config incept.config.js and move to root folder
  const config = Loader.config();
  fs.writeFileSync(
    `${root}/config.json`, 
    JSON.stringify(config, null, 2)
  );

  const directory = project.createDirectory(root);
  const plugins = Loader.plugins(root, config.plugins || []);
  generateIndex(directory, schemas);
  generateApp(directory, plugins);
  generateBootSchema(directory, schemas);
  generateBootError(directory);
  generateBootObject(directory);
  generateBootCollection(directory);
  generateBootRoutes(directory, schemas);
  for (const name in schemas) {
    generateTypes(directory, schemas[name], schemas);
    generateValidate(directory, schemas[name]);
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
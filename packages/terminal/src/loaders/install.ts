//helpers
import fs from 'fs';
import path from 'path';
import { Project, IndentationText } from 'ts-morph';
import Loader from '../types/Loader';
//generators
import generateInstall from '../generators/server/install';
import generateBootError from '../generators/server/loaders/error';

export default function generate() {
  const modules = Loader.modules();
  const root = `${modules}/.incept/server`;
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
  generateInstall(directory, plugins);
  generateBootError(directory);
  
  project.emit();
}
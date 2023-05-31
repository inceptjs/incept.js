//helpers
import fs from 'fs';
import path from 'path';

export function getConfig(cwd: string) {
  //look in ev3.config.js for the schema files
  if (fs.existsSync(path.join(cwd, 'incept.config.json'))) {
    const contents = fs.readFileSync(path.join(cwd, 'incept.config.json'), 'utf8');
    try {
      return JSON.parse(contents) || {};
    } catch(e) {}
    return {};
  //look in ev3.config.json for the schema files
  //} else if (fs.existsSync(path.join(cwd, 'incept.config.js'))) {
  //  return require(path.join(cwd, 'incept.config.js')) || {};
  //look in package.json for the schema files
  } else if (fs.existsSync(path.join(cwd, 'package.json'))) {
    const contents = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8');
    try {
      return JSON.parse(contents)?.incept || {};
    } catch(e) {}
    return {};
  }

  return {};
};

export function findNodeModules(cwd: string): string {
  if (cwd === '/') {
    throw new Error('Could not find node_modules');
  }
  if (fs.existsSync(path.resolve(cwd, 'node_modules/inceptjs'))) {
    return path.resolve(cwd, 'node_modules');
  }
  return findNodeModules(path.dirname(cwd));
};

export function getSchemaFolder(cwd: string) {
  const config = getConfig(cwd);
  const folder = config.schemas as string || './schema';
  if (folder.indexOf('./') === 0) {
    return path.join(cwd, folder.replace('./', '')); 
  } else if (folder.indexOf('../') === 0) {
    return path.join(path.dirname(cwd), folder.replace('../', '')); 
  }
  return folder;
}
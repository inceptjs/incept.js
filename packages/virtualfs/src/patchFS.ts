import realFS from 'fs';
import { Volume } from 'memfs/lib/volume';

//@ts-ignore
const fs = realFS as Record<string, Function>;

const syncToPatch: string[] = [
  'readFileSync',
  'existsSync',
  'lstatSync',
  'statSync',
  'realpathSync',
  'readdirSync'
];

const asyncToPatch: string[] = [
  'readFile',
  'exists',
  'lstat',
  'stat',
  'realpath',
  'readdir'
];

function syncMethod(
  method: string, 
  original: Record<string, Function>, 
  vfs: Record<string, Function>
): Function {
  return (...args: any[]) =>  {
    let results;
    try { //to get the results from the real fs
      results = original[method].apply(fs, args);
    } catch(fsError) {
      //if there's an error from the real fs
      try { //to return the results from the virtual fs
        //@ts-ignore
        return vfs[method].apply(vfs, args);
      } catch(vfsError) {
        //if that also threw an error, then throw the real fs error
        throw fsError;
      }
    }
    //if the original method is false
    if (results === false) {
      //@ts-ignore try to return the virtual fs method
      return vfs[method].apply(vfs, args);
    }
    //other wise, return the real fs results
    return results;
  }
}

function asyncMethod(
  method: string, 
  original: Record<string, Function>, 
  vfs: Record<string, Function>
): Function {
  return (...args: any[]) =>  {
    let callback = null;
    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop() as Function;
    }

    try { //to call the sync version
      const results = syncMethod(`${method}Sync`, original, vfs).apply(null, args);
      if (typeof callback === 'function') {
        callback(null, results);
      } else {
        //no callback, so return a promise
        return {
          then: function(callback: Function) {
            callback(results);
            return this;
          },
          catch: function(callback: Function) {
            return this;
          }
        }
      }
    } catch(error) {
      if (typeof callback === 'function') {
        callback(error, null);
      } else {
        //no callback, so return a promise
        return {
          then: function(callback: Function) {
            return this;
          },
          catch: function(callback: Function) {
            callback(error);
            return this;
          }
        }
      }
    }
  }
}

export default function patchFS(vfs: Volume) {
  const original: Record<string, Function> = {};
  for (const method of syncToPatch) {
    original[method] = fs[method];
    //@ts-ignore
    fs[method] = syncMethod(method, original, vfs);
  }

  for (const method of asyncToPatch) {
    original[method] = fs[method];
    //@ts-ignore
    fs[method] = asyncMethod(method, original, vfs);
  }

  return function revertFS() {
    for (const method of syncToPatch) {
      //@ts-ignore
      fs[method] = original[method];
    }

    for (const method of asyncToPatch) {
      //@ts-ignore
      fs[method] = original[method];
    }
  }
}
import defaults from './defaults'
import babelRegister from '@babel/register'

export default class WithBabel {
  register(config: Record<string, any>): WithBabel {
    const clone = Object.assign({}, config);
    const options = defaults as Record<string, any>;

    //softly merge if array and hard merge if anything else
    for (const key in config) {
      if (Array.isArray(options[key])) {
        if (!Array.isArray(clone[key])) {
          clone[key] = [ clone[key] ];
        }
        options[key].push.apply(options[key], clone[key]);
      } else {
        options[key] = clone[key];
      }
    }

    babelRegister(options);
    return this
  }
}
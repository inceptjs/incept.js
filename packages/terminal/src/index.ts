import Loader from './types/Loader';
import Terminal from './types/Terminal';

import { 
  getTypeName,
  getTypeExtendedName,
  isRequired,
  capitalize,
  formatCode  
} from './generators/utils';

const utils = {
  getTypeName,
  getTypeExtendedName,
  isRequired,
  capitalize,
  formatCode 
};

export { Loader, Terminal, utils };
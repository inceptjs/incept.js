import path from 'path';
import { declare } from '@babel/helper-plugin-utils';

module.exports = declare(() => {
  return {
    name: 'ignore-import',
    visitor: {
      CallExpression: {
        enter(nodePath, { opts }) {
          const { except = [ '.js' ] } = opts as Record<string, any>;
          const callee = nodePath.get('callee');

          if (callee.isIdentifier() && callee.equals('name', 'require')) {
            const arg = nodePath.get('arguments')[0];
            if (arg && arg.isStringLiteral()) {
              const extension = path.extname(arg.node.value);
              if (extension.length && except.indexOf(extension) === -1) {
                nodePath.remove();
              }
            }
          }
        }
      },
      ImportDeclaration(nodePath, { opts }) {
        const { except = [ '.js' ] } = opts as Record<string, any>;
        const extension = path.extname(nodePath.node.source.value);
        if (extension.length && except.indexOf(extension) === -1) {
          nodePath.remove();
        }
      }
    }
  };
});
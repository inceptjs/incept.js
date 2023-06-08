import { program } from 'commander';
import Loader from './types/Loader';
import generateServer from './commands/generate/server';
import generateClient from './commands/generate/client';

program
  .name('string-util')
  .description('CLI for Incept')
  .version('0.0.30');

program.command('generate')
  .description('Generates code based on your schema files')
  .option('-u, --ui <react|tailwind>', 'UI generator', 'react')
  .option('-l, --location <path>', 'Path to generate')
  .option('-t, --ts', 'Generate Typescript instead')
  .option('-p, --platform <server|client|all>', 'Which platform to generate', 'all')
  .action(options => {
    console.log('Generating code...');
    const ts = !!options.ts || false;
    if (!options.location) {
      options.location = Loader.modules();
    }
    if (options.platform === 'server' || options.platform === 'all') {
      const root = `${options.location}/.incept/server`;
      generateServer(root, ts);
    }
    if (options.platform === 'client' || options.platform === 'all') {
      const root = `${options.location}/.incept/client`;
      generateClient(root, ts, options.ui || 'react');
    }
    console.log('Done!');
  });


program.parse();
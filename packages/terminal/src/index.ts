import { program } from 'commander';
import generateClient from './generate/client';
import generateServer from './generate/server';

program
  .name('string-util')
  .description('CLI for Incept')
  .version('0.0.30');

program.command('generate')
  .description('Generates code based on your schema files')
  .option('-p, --platform <client|server|all>', 'Platform to generate', 'all')
  .option('-u, --ui <react|tailwind>', 'UI generator for client platform', 'react')
  .action(options => {
    options.platform = options.platform || 'all';
    if (options.platform === 'all' || options.platform === 'server') {
      generateServer();
    }
    if (options.platform === 'all' || options.platform === 'client') {
      generateClient(options.ui || 'react');
    }
    console.log('Done!');
  });

program.parse();
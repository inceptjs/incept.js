import { program } from 'commander';
import generate from './generate';

//this is the project's directory
//const cwd = process.cwd();
//this is the arguments
//const argv = process.argv;
//load the bootstrap file

program
  .name('string-util')
  .description('CLI for Incept')
  .version('0.0.30');

program.command('generate')
  .description('Generates code based on your schema files')
  .option('-u, --ui <react|tailwind>', 'UI generator', 'react')
  .action(options => {
    generate(options.ui || 'react');
    console.log('Done!');
  });

program.command('push')
  .description('Pushes database changes')
  .option('-m, --message <message>', 'Commit message. This will create a migration file')
  .option('-m, --message <message>', 'Commit message. This will create a migration file')
  .action(options => {
    console.log('Pushing...');

  });


program.parse();
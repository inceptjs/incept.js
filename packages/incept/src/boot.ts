import Application from './types/Application';

import develop from './plugin/develop';
import terminal from './plugin/terminal';

//this is the project's directory
const cwd = process.cwd();
//this is the arguments
const argv = process.argv;
//make an application
const app = new Application(cwd);
//bootstrap the terminal
app.bootstrap(terminal);
//bootstrap development tools
app.bootstrap(develop);
//bootstrap the server plugins 
//(which usually are defined in the project)
app.load();
//now let the terminal take over...
app.plugin('terminal').emit(cwd, argv);

export default app;
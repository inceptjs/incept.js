import app from '../app'

import build from './plugin/build';
import start from './plugin/start';
import develop from './plugin/develop';
import terminal from './plugin/terminal';

//this is the project's directory
const cwd = process.cwd();
//this is the arguments
const argv = process.argv;
//bootstrap the terminal
app.bootstrap(terminal);
//bootstrap development tools
app.bootstrap(develop);
//bootstrap build tool
app.bootstrap(build);
//bootstrap start tool
app.bootstrap(start);
//bootstrap the server plugins 
//(which usually are defined in the project)
app.load();
//now let the terminal take over...
app.plugin('terminal').emit(cwd, argv);
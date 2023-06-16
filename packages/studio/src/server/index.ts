import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';

import { Framework } from 'inceptjs';
import loader from './loader';
import config from '.incept/server/config.json';
const app = new Framework(config);
app.load(loader);

//mock rr
const im = new IncomingMessage(new Socket());
const sr = new ServerResponse(im);
//make payload
const { request, response } = app.payload(im, sr);
app.emit('studio', request, response);

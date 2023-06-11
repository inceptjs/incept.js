import { Socket } from 'net';
import { IncomingMessage, ServerResponse } from 'http';

import { Framework } from 'inceptjs';
import loader from './loader';

const app = new Framework();
app.load(loader);

//mock rr
const im = new IncomingMessage(new Socket());
const sr = new ServerResponse(im);
//make payload
const { request, response } = app.payload(im, sr);
app.emit('studio', request, response);

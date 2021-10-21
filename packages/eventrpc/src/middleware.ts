import { IncomingMessage, ServerResponse } from 'http';
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite';
import { EventEmitter, Request, Response } from '@inceptjs/framework';

const defaultNext = (error: Error) => { if(error) throw error };

export default function createMiddleware(
  serverEmitter: EventEmitter = new EventEmitter,
  routepath = '/eventrpc'
): Function {
  function Middleware(
    im: IncomingMessage, 
    sr: ServerResponse, 
    next: Function
  ) {
    next = next || defaultNext;
    if (im.url !== routepath) {
      return next();
    }

    const req = new Request();
    const res = new Response();
    req.set('resource', im)
    res.set('resource', sr)

    const chunks: Buffer[] = [];
    im.on('data', function (data: Buffer) {
      chunks.push(data)
    });

    im.on('end', async() => {
      //write the chunks to req body
      req.write(Buffer.concat(chunks))
      //so we can parse it
      let payload = req.parseJSON();
      //if payload is not an object
      if (typeof payload !== 'object') {
        //we cannot process
        return next();
      }

      //if we dont know the rpc
      if (!payload.jsonrpc || !payload.method) {
        //let someone else handle it
        return next();
      }

      //get the event
      const event = payload.method;
      //set the params
      req.set('params', payload.params);

      //placeholder for response
      let response = null;

      try {
        serverEmitter.emit(event, req, res);
        response = jsonrpc.success(payload.id, res.body)
      } catch(error) {
        response = jsonrpc.error(payload.id, error as JsonRpcError);
      }

      //send it off
      sr.setHeader('Content-Type', 'text/json');
      sr.write(JSON.stringify(response));
      sr.end();

      return next();
    });
  }

  return Middleware;
}
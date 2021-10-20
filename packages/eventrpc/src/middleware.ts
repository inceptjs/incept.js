import { IncomingMessage, ServerResponse } from 'http';
import jsonrpc, { JsonRpcError } from 'jsonrpc-lite';
import { EventEmitter } from '@inceptjs/framework';

const defaultNext = (error: Error) => { if(error) throw error };

export default function createMiddleware(
  serverEmitter: EventEmitter = new EventEmitter,
  routepath = '/eventrpc'
): Function {
  function Middleware(
    req: IncomingMessage, 
    res: ServerResponse, 
    next: Function
  ) {
    next = next || defaultNext;
    if (req.url !== routepath) {
      return next();
    }

    const chunks: (string|Buffer)[] = [];
    req.on('data', function (data: string|Buffer) {
      chunks.push(data)
    });

    req.on('end', async() => {
      //get payload
      let payload = JSON.parse(chunks.join(''));
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

      const method = payload.method;
      let args = payload.params || [];
      if (!Array.isArray(args)) {
        args = [args];
      }

      //placeholder for response
      let response = null;

      try {
        serverEmitter.emit(method, ...args);
        response = jsonrpc.success(payload.id, args)
      } catch(error) {
        response = jsonrpc.error(payload.id, error as JsonRpcError);
      }

      //send it off
      res.setHeader('Content-Type', 'text/json');
      res.write(JSON.stringify(response));
      res.end();

      return next();
    });
  }

  return Middleware;
}
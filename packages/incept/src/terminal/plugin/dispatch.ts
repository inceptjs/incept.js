import { 
  EventEmitter, 
  Request, 
  Response,
  Statuses
} from '@inceptjs/framework/dist/presets/http';

const emitter = new EventEmitter

/**
 * Translates response back into the original payload
 */
emitter.on('dispatch', async function dispatchResponse(
  request: Request, 
  response: Response
) {
  const sr = response.resource;
  //if it was already sent off 
  if (sr.headersSent) {
    //dont send again
    return;
  }

  sr.statusCode = response.status || Statuses.OK.code;
  sr.statusMessage = response.statusText || Statuses.OK.text;

  //copy all the headers to the server response
  for (const pair of response.headers.entries()) {
    sr.setHeader(pair[0], pair[1]);
  }

  //get the body
  let body = response.body;

  //if the response body is streamable
  if (typeof body?.pipe === 'function') {
    //pipe it through
    body.pipe(sr);
    //end of pipe will end the connection
  } else if (typeof body?.pipeTo === 'function') {
    //pipe it through
    body.pipeTo(sr);
    //end of pipe will end the connection
  } else {
    sr.end(body);
  }
});

export default emitter;

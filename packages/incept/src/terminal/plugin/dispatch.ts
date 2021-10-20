import { 
  EventEmitter, 
  Request, 
  Response 
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

  sr.statusCode = parseInt(response.get('status', 'code')) || 200;
  sr.statusMessage = response.get('status', 'text') || 'OK';

  //copy all the headers to the server response
  const headers = response.get('header')
  if (headers 
    && typeof headers === 'object' 
    && Object.keys(headers).length
  ) {
    Object.keys(headers).forEach(name => {
      sr.setHeader(name, headers[name]);
    });
  }
    
  //get the body
  let body = response.body;

  //if the response body is streamable
  if (body && typeof body.pipe === 'function') {
    //pipe it through
    body.pipe(sr);
    //end of pipe will end the connection
  } else {
    //dispatch event gave every opporitunity to change the 
    //body into a string. If it's still an object here
    //then we need to convert it to a string (let's just JSONify it)
    if (body && typeof body === 'object') {
      body = JSON.stringify(Object.assign({}, body));
    }

    if (body !== null && String(body).length) {
      //send off the response
      //and close the connection
      sr.end(String(body));
    } else {
      //just close the connection
      sr.end();
    }
  }
});

export default emitter;

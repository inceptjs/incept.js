import { 
  EventEmitter, 
  Request, 
  Response, 
  Statuses 
} from '@inceptjs/framework';

/**
 * Sends the error to the logger
 */
function logError(this: EventEmitter, error: Error): void {
  //@ts-ignore
  if (error.code === 404) {
    return
  }

  this.emit('log', error, 'error')
}

/**
 * Logs that a new request has been made
 */
function logRequest(this: EventEmitter, request: Request): void {
  const message = `REQ: ${request.method} ${request.pathname}`
  this.emit('log', message, 'system')
}

/**
 * Logs the response status
 */
function logResponse(
  this: EventEmitter, 
  request: Request, 
  response: Response
): void {
  const { code, text } = response.get('status') || Statuses.OK

  let type = 'info';
  switch(true) {
    case 200 <= code && code < 300:
      type = 'success'
      break
    case 300 <= code && code < 400:
      type = 'info'
      break
    case 400 <= code && code < 500:
      type = 'warning'
      break
    case 500 <= code && code < 600:
      type = 'error'
      break
  }

  this.emit('log', `RES: ${code} ${text}`, type)
}

export { logError, logRequest, logResponse }
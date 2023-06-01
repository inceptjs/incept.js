import type { IncomingMessage } from 'http';
import type { EventAction } from '@inceptjs/types/dist/EventEmitter';
import type Exception from '@inceptjs/types/dist/Exception';

import type Request from './types/Request';
import type Response from './types/Response';
import type { NestedScalarObject, APIResponse } from '../types';

export type ExpressLikeMessage = IncomingMessage & {
  //params?: NestedScalarObject;
  //query?: NestedScalarObject;
  body?: NestedScalarObject|string;
  //cookies?: NestedScalarObject;
  //headers?: NestedScalarObject;
};

export type RouteAction = EventAction<
  [ Request, Response<APIResponse>, Exception? ]
>;

export type RouteParams = {
  args: string[];
  params: NestedScalarObject;
};

export type Cookie = { 
  value: string,  
  options: {
    domain?: string,
    expires?: Date,
    httpOnly?: boolean,
    maxAge?: number,
    path?: string,
    sameSite?: boolean|'lax'|'strict'|'none',
    secure?: boolean
  }
}
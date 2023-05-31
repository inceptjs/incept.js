import type { IncomingMessage } from 'http';
import type { NestedScalarObject } from '../types';

export type ExpressLikeMessage = IncomingMessage & {
  //params?: NestedScalarObject;
  //query?: NestedScalarObject;
  body?: NestedScalarObject|string;
  //cookies?: NestedScalarObject;
  //headers?: NestedScalarObject;
};

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
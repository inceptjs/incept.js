import type Request from '../types/Request';
import type Response from '../types/Response';
import type { APIResponse } from '../../types';

import Exception from '../types/Exception';
import EventEmitter from '@inceptjs/types/dist/EventEmitter';

const emitter = new EventEmitter<
  [ Request, Response<APIResponse>, Exception? ]
>();

emitter.on('error', (req, res, e) => {
  if (!e) return;
  res.json(e.toJSON() as APIResponse);
});

export default emitter;
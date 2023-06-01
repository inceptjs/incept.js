import type { Method } from '../../types';
import Schema from '../types/Schema';
import app from '../app';

//forward all routes to events
Schema.routes.forEach(route => {
  const method = route.method as Method;
  app[method](route.path, async (req, res) => {
    //set body
    for (const name in route.body) {
      req.stage(name, route.body[name]);
    }
    //set url params
    req.route(route.path, true);
    await app.emit(route.event, req, res);
  });
  app.route(route.path)
});
import type { Framework, Method } from 'inceptjs/server';

import { Schema } from 'inceptjs/server';

export default function boot(ctx: Framework) {
  //forward all routes to events
  Schema.routes.forEach(route => {
    const method = route.method as Method;
    ctx[method](route.path, async (req, res) => {
      //set body
      for (const name in route.body) {
        req.stage(name, route.body[name]);
      }
      //set url params
      req.route(route.path, true);
      await ctx.emit(route.event, req, res);
    });
    ctx.route(route.path)
  });
};
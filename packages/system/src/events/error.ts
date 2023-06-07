import type { Framework } from 'inceptjs/server';
import type { APIResponse } from 'inceptjs';

export default function boot(ctx: Framework) {
  /**
   * Transform errors into JSON response
   */
  ctx.on('error', (req, res, e) => {
    if (!e) return;
    res.json(e.toJSON() as APIResponse);
  });
};
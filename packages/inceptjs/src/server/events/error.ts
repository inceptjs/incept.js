import type { APIResponse } from '../../types';
import app from '../app';

/**
 * Transform errors into JSON response
 */
app.on('error', (req, res, e) => {
  if (!e) return;
  res.json(e.toJSON() as APIResponse);
});
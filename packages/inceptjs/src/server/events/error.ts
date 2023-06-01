import type { APIResponse } from '../../types';
import app from '../app';

app.on('error', (req, res, e) => {
  if (!e) return;
  res.json(e.toJSON() as APIResponse);
});
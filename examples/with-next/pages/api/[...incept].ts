import type { NextApiRequest, NextApiResponse } from 'next';
import app from 'inceptjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response  = await app.handle(req, res);
  response.send();
}
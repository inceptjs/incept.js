import type { NextApiRequest, NextApiResponse } from 'next';
import app from 'inceptjs/server';

app.on('dispatch', (req, res) => {
  res.write({error: false, results: 'Hello World!'});
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.url)
  //check schema configs for routes -> event
  const response  = await app.handle(req, res);
  response.send();
}
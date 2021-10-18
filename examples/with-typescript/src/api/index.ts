import { Router, Request, Response } from 'inceptjs'

const router = new Router

router.get('/api/rest', (req: Request, res: Response) => {
  res.body = { error: false }
}, 10)

export default router
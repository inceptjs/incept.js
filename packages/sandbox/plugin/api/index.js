import { Router } from 'inceptjs'

const router = new Router

router.get('/api/rest', (req, res) => {
  res.body = { error: false }
}, 10)

export default router
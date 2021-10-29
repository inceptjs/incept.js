import { Router } from 'inceptjs'

const router = new Router

router.get('/api/rest', (req, res) => {
  res.write({ error: false })
}, 10)

export default router
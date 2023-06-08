import { app } from 'inceptjs/server';
app.get('/api/user/:name', (req, res) => {
  res.json({ error: false, results: 'Hello World!' })
  return false;
}, 1)
app.on('system-object-detail', (req, res) => {
  res.json({ error: false, results: 'Hello World 2!' })
})
export default app.send.bind(app);
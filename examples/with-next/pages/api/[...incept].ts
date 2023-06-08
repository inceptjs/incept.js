import { app } from 'inceptjs/server';
app.on('system-object-detail', (req, res) => {
  res.json({ error: false, results: 'Hello World!' })
})
export default app.send.bind(app);
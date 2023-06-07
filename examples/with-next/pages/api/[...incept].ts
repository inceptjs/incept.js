import { app } from 'inceptjs/server';
import { routes, events, schema } from '@inceptjs/system'
import mysql from '@inceptjs/storm/mysql';
import store from 'mysql2';

app.loader(schema);
app.loader(events);
app.loader(routes);
app.loader(mysql);
app.loader(ctx => {
  ctx.plugin('storm-mysql').set(
    process.env.DB_KEY, 
    store.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    })
  );
});

app.load();

export default app.send.bind(app);
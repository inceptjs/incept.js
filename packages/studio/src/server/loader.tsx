import http from 'http';

import { Framework } from 'inceptjs';
import appRoutes from './routes/app';
import middlewareRoutes from './routes/middleware';
import schemaRoutes from './routes/schema';
import fieldsetRoutes from './routes/fieldset';

export default function boot(ctx: Framework) {
  ctx.on('studio', (req, res) => {
    const port = req.params.port || req.params.p || 1337;
    const app = new Framework(ctx.config);

    app.load(middlewareRoutes);
    app.load(appRoutes);
    app.load(schemaRoutes);
    app.load(fieldsetRoutes);

    //create the http server
    const server = http.createServer(app.send.bind(app));
    //now start listening to the server
    server.listen(port);
    console.log('Server started on :1337');   
  })
}
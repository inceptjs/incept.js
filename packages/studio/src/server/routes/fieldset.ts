import { Framework } from 'inceptjs';

export default function boot(ctx: Framework) {
  //search
  ctx.get('/api/fieldset', (req, res) => {});

  //create
  ctx.post('/api/fieldset', (req, res) => {});

  //update
  ctx.put('/api/fieldset/:name', (req, res) => {});

  //remove
  ctx.delete('/api/fieldset/:name', (req, res) => {});
};
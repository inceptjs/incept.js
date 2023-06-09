import type { Framework } from 'inceptjs';
import type { PrismaClient } from '@prisma/client';
import type { Relation } from './types';

import Query from './types/Query';
import Exception from './types/Exception';

export default function boot(ctx: Framework) {
  const connections: Record<string, PrismaClient> = {};

  ctx.on('system-store-collection-insert', async (req, res) => {
    const { collection, data } = req.getParams<{
      collection: string,
      data: Record<string, any>|Record<string, any>[]
    }>();

    if (typeof collection !== 'string') {
      throw Exception.for('Collection not provided');
    }

    if (!data || !Array.isArray(data) || typeof collection !== 'object') {
      throw Exception.for('Invalid data provided');
    }

    const query = Query.insert(collection).values(data).toParams();
    const store = ctx.plugin('prisma').get(req.params.store) as PrismaClient;
    const results = await store.$executeRaw`${query}`;
    res.json({ error: false, results });
  });

  ctx.on('system-store-collection-delete', async (req, res) => {
    const { collection, filters } = req.getParams<{
      collection: string,
      filters: Record<string, any>
    }>();

    if (typeof collection !== 'string') {
      throw Exception.for('Collection not provided');
    }

    const builder = Query.delete(collection);
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        if (typeof filter === 'string') {
          builder.where(filter);
        } else if (Array.isArray(filter)) {
          builder.where(filter[0], filter[1]);
        }
      });
    }

    const query = builder.toParams();
    const store = ctx.plugin('prisma').get(req.params.store) as PrismaClient;
    const results = await store.$executeRaw`${query}`;
    res.json({ error: false, results });
  });

  ctx.on('system-store-collection-select', async (req, res) => {
    const { 
      collection, 
      columns, 
      relations, 
      filters, 
      sort, 
      offset = 0, 
      limit 
    } = req.getParams<{
      collection: string,
      columns?: string|string[],
      relations?: Relation[],
      filters?: (string|[string, (string|number)[]])[],
      sort?: [string, 'ASC'|'DESC'|'asc'|'desc'][],
      offset?: number,
      limit?: number
    }>();

    if (typeof collection !== 'string') {
      throw Exception.for('Collection not provided');
    }

    const builder = Query.select(columns || '*').from(collection);
    //relations
    if (Array.isArray(relations)) {
      relations.forEach(relation => {
        builder.join(
          relation.type, 
          relation.table, 
          relation.from, 
          relation.to, 
          relation.as
        );
      })
    }
    //filters
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        if (typeof filter === 'string') {
          builder.where(filter);
        } else if (Array.isArray(filter)) {
          builder.where(filter[0], filter[1]);
        }
      });
    }
    //sort
    if (Array.isArray(sort)) {
      sort.forEach(sort => {
        builder.order(sort[0], sort[1]);
      });
    }
    builder.offset(offset);
    if (limit) {
      builder.limit(limit);
    }

    const query = builder.toParams();
    const store = ctx.plugin('prisma').get(req.params.store) as PrismaClient;
    const results = await store.$executeRaw`${query}`;
    res.json({ error: false, results });
  });

  ctx.on('system-store-collection-update', async (req, res) => {
    const { collection, data, filters } = req.getParams<{
      collection: string,
      data: Record<string, any>,
      filters: (string|[string, (string|number)[]])[]
    }>();

    if (typeof collection !== 'string') {
      throw Exception.for('Collection not provided');
    }

    if (!data || typeof collection !== 'object') {
      throw Exception.for('Invalid data provided');
    }

    const builder = Query.update(collection).set(data);
    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        if (typeof filter === 'string') {
          builder.where(filter);
        } else if (Array.isArray(filter)) {
          builder.where(filter[0], filter[1]);
        }
      });
    }

    const query = builder.toParams();
    const store = ctx.plugin('prisma').get(req.params.store) as PrismaClient;
    const results = await store.$executeRaw`${query}`;
    res.json({ error: false, results });
  });

  ctx.on('generate', (req, res) => {
    //skip, if there is an error
    if (res.body?.error) return;
    //const location = req.params.location as string;
    const platform = req.params.platform as string;
    //const engine = (req.params.engine || req.params.e || 'mysql') as string;

    if (platform === 'server' || platform === 'all') {
      console.log('Generating prisma...');
      //generate(engine, location)
      console.log('Done!');
    }
    
    res.json({ error: false });
  });

  ctx.plugin('prisma', {
    add: (name: string, connection: PrismaClient) => {
      connections[name] = connection;
    },
    get: (name: string) => {
      if (!name) {
        throw Exception.for('Connection name not provided');
      } else if (!connections[name]) {
        throw Exception.for(`Connection ${name} not found`);
      }
      return connections[name] as PrismaClient;
    }
  });
};
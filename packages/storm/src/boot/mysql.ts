import type { Connection, PoolConnection } from 'mysql2';
import type { Framework } from 'inceptjs/server';
import type { Field, Relation } from '../types';

import Exception from '../types/Exception';
import Query from '../types/Query';

export default function boot(ctx: Framework) {
  const connections: Record<string, Connection|PoolConnection> = {};

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

    const { query, values } = Query.insert(collection).values(data).toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
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

    const { query, values } = builder.toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
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

    const { query, values } = builder.toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
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

    const { query, values } = builder.toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
  });

  ctx.on('system-store-schema-create', async (req, res) => {
    const { table, fields, indexes } = req.getParams<{
      table: string,
      fields?: Record<string, Field>,
      indexes?: {
        type: 'primary'|'unique'|'key',
        name: string,
        columns?: string|string[]
      }[]
    }>();

    const builder = Query.create(table);
    if (fields && typeof fields === 'object') {
      Object.keys(fields).forEach(name => {
        if (fields[name] && typeof fields[name] === 'object') {
          builder.addField(name, fields[name]);
        }
      }); 
    }

    if (Array.isArray(indexes)) {
      indexes.forEach((index: {
        type: 'primary'|'unique'|'key',
        name: string,
        columns?: string|string[]
      }) => {
        if (index.type === 'primary') {
          builder.addPrimaryKey(index.name);
        } else if (index.type === 'unique') {
          builder.addUniqueKey(index.name, index.columns || []);
        } else {
          builder.addKey(index.name, index.columns || []);
        }
      }); 
    }

    const { query, values } = builder.toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
  });

  ctx.on('system-store-schema-alter', async (req, res) => {
    const { table, delete: remove, add, change } = req.getParams<{
      table: string,
      delete?: {
        fields?: string[],
        keys?: string[],
        uniques?: string[],
        primaries?: string[]
      },
      change?: Record<string, Field>,
      add?: {
        fields?: Record<string, Field>,
        indexes?: {
          type: 'primary'|'unique'|'key',
          name: string,
          columns?: string|string[]
        }[]
      }
    }>();

    const builder = Query.alter(table as string);
    if (Array.isArray(remove?.fields)) {
      remove?.fields.forEach((field: string) => {
        builder.removeField(field);
      });
    }

    if (Array.isArray(remove?.primaries)) {
      remove?.primaries.forEach((primary: string) => {
        builder.removePrimaryKey(primary);
      });
    }

    if (Array.isArray(remove?.uniques)) {
      remove?.uniques.forEach((key: string) => {
        builder.removeUniqueKey(key);
      });
    }

    if (Array.isArray(remove?.keys)) {
      remove?.keys.forEach((key: string) => {
        builder.removeKey(key);
      });
    }

    if (typeof change === 'object') {
      Object.keys(change).forEach((field: string) => {
        builder.changeField(field, change[field]);
      });
    }

    if (typeof add?.fields === 'object') {
      Object.keys(add.fields).forEach(name => {
        if (add.fields && add.fields[name]) {
          builder.addField(name, add.fields[name]);
        }
      });
    }

    if (Array.isArray(add?.indexes)) {
      add?.indexes.forEach(index => {
        if (index.type === 'primary') {
          builder.addPrimaryKey(index.name);
        } else if (index.type === 'unique') {
          builder.addUniqueKey(index.name, index.columns || [ index.name ]);
        } else {
          builder.addKey(index.name, index.columns || [ index.name ]);
        }
      }); 
    }

    const { query, values } = builder.toParams();
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(query, values);
    res.json(results);
  });

  ctx.on('system-store-schema-delete', async (req, res) => {
    const { table } = req.params;
    const store = ctx.plugin('storm-mysql').get(req.params.store);
    const results = await store.execute(`DROP TABLE IF EXISTS \`${table}\``);
    res.json(results);
  });

  ctx.plugin('storm-mysql', {
    add: (name: string, connection: Connection|PoolConnection) => {
      connections[name] = connection;
    },
    get: (name: string) => {
      if (!connections[name]) {
        throw Exception.for(`Connection ${name} not found`);
      }
      return connections[name];
    }
  });
};
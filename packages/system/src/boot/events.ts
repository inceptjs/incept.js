import type { Framework } from 'inceptjs/server';

import bootCollectionEvents from '../events/collection';
import bootErrorEvents from '../events/error';
import bootObjectEvents from '../events/object';

export default function boot(ctx: Framework) {
  bootCollectionEvents(ctx);
  bootErrorEvents(ctx);
  bootObjectEvents(ctx);
};
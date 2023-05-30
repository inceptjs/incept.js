//react
import { useState } from 'react';

export default function useFilters(
  data: Record<string, any> = {}
) {
  const [ filters, setFilters ] = useState(data);
  const handlers = {
    filter: (terms: Record<string, any> | boolean) => {
      const filterable = Object.assign({}, filters || {});
      // this is to remove all the sort[*] on the filters.
      delete filterable[
        Object.keys(filterable).find(
          key => filterable[key] === 'desc' || filterable[key] === 'asc'
        ) as string
      ];
      if (typeof terms === 'boolean') {
        // handle the case where terms is a boolean
        if (!terms) {
          // if terms is false, remove all filters
          setFilters({});
          return;
        }
        // if terms is true, use the existing filters
      }
      terms = terms as Record<string,any>;
      // handle the case where terms is an object
      if (terms) { // type guard to check if terms is a Record<string, any>
        for (const key in terms) {
          const type = typeof terms[key];
          // if not a scalar type
          if (['string', 'boolean', 'number'].indexOf(type) < 0
            // or empty string
            || (type === 'string' && !terms[key].length)
          ) {
            // it's not filterable
            delete filterable[key];
            continue;
          }

          filterable[key] = terms[key];
        }
        setFilters({ ...filterable });
      }
    },

    sort: (name: string) => {
      const filterable = filters || {};
      const key = `sort[${name}]`;
      let direction = undefined;
      if (typeof filterable[key] === 'undefined') {
        direction = 'desc';
      } else if (filterable[key] === 'desc') {
        direction = 'asc';
      }
      handlers.filter({ [key]: direction });
    },

    remove: (remove: string[]) => {
      if (filters) {
        for (const key in filters) {
          if (remove.includes(key)) {
            delete filters[key];
          }
        }
        setFilters({ ...filters });
      }
    },

    reset: (query?: Record<string, any>) => {
      const filterable = Object.assign({}, query || data);
      setFilters({ ...filterable });
    }
  };

  return { filters, handlers };
}
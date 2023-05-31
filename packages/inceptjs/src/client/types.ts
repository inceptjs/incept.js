import { FormEvent } from 'react';

export type FetchStatuses = 'pending'|'fetching'|'complete';
export type FetchRouteParams = {
  args: (string|number)[],
  params: Record<string, string|number>
};

export type FetchCallConfig = FetchRouteParams & {
  query?: Record<string, string|number>,
  data?: Record<string, any>
}

export type FilterHandlers = {
  send: (e: FormEvent) => boolean,
  filter: (terms: Record<string, any> | boolean) => void,
  sort: (name: string) => void,
  remove: (remove: string[]) => void,
  reset: (query?: Record<string, any>) => void
};

export type FormHandlers = {
  send: (e: FormEvent) => boolean,
  change: (paths: string|string[], value: any) => void
};
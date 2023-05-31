const safeValue = (value: any) => required(value) ? value: '';

//general
export const ne = (value: any, compare: any) => value != compare;
export const notempty = (value: any) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'number') return value !== 0;
  return safeValue(value).toString().length > 0;
};
export const option = (value: any, options: any[]) => options.includes(value);
export const regex = (value: any, regex: string|RegExp) => new RegExp(regex).test(safeValue(value).toString());
export const required = (value: any) => value !== null && typeof value !== 'undefined';
//date
export const date = (value: any) => regex(value, /^\d{4}-\d{2}-\d{2}$/);
export const datetime = (value: any) => regex(value, /^\d{4}(\-\d{2}){2}(T|\s){1}\d{2}(:\d{2}){1,2}(\.\d{3}){0,1}Z{0,1}$/);
export const time = (value: any) => regex(value, /^\d{2}:\d{2}(:\d{2})*$/);
export const future = (value: any) => new Date(value || 0) > new Date();
export const past = (value: any) => new Date(value || 0) < new Date();
export const present = (value: any) => new Date(value || 0).toDateString() === new Date().toDateString();
//number
export const gt = (value: any, compare: any) => (Number(value) || 0) > (Number(compare) || 0);
export const gte = (value: any, compare: any) => (Number(value) || 0) >= (Number(compare) || 0);
export const lt = (value: any, compare: any) => (Number(value) || 0) < (Number(compare) || 0);
export const lte = (value: any, compare: any) => (Number(value) || 0) <= (Number(compare) || 0);
export const float = (value: any) => regex(value, /^\d+\.\d+$/);
export const integer = (value: any) => regex(value, /^\d+$/);
export const number = (value: any) => regex(value, /^\d+(\.\d+)*$/);
export const price = (value: any) => regex(value, /^\d+(\.\d{2})*$/);
//string
export const cgt = (value: any, compare: any) => gt(safeValue(value).toString().length, safeValue(compare).toString().length);
export const cgte = (value: any, compare: any) => gte(safeValue(value).toString().length, safeValue(compare).toString().length);
export const clt = (value: any, compare: any) => lt(safeValue(value).toString().length, safeValue(compare).toString().length);
export const clte = (value: any, compare: any) => lte(safeValue(value).toString().length, safeValue(compare).toString().length);
export const wgt = (value: any, compare: any) => gt(safeValue(value).toString().split(' ').length, safeValue(compare).toString().split(' ').length);
export const wgte = (value: any, compare: any) => gte(safeValue(value).toString().split(' ').length, safeValue(compare).toString().split(' ').length);
export const wlt = (value: any, compare: any) => lt(safeValue(value).toString().split(' ').length, safeValue(compare).toString().split(' ').length);
export const wlte = (value: any, compare: any) => lte(safeValue(value).toString().split(' ').length, safeValue(compare).toString().split(' ').length);
//type
export const cc = (value: any) => regex(value, /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
export const email = (value: any) => regex(value, /^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])){3}\])$/);
export const hex = (value: any) => regex(value, /^[a-f0-9]+$/);
export const color = (value: any) => regex(value, /^#?([a-f0-9]{6}|[a-f0-9]{3})$/);
export const url = (value: any) => regex(value,/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\/?/i);

const validators = {
  ne,
  notempty,
  option,
  regex,
  required,
  date,
  datetime,
  time,
  future,
  past,
  present,
  gt,
  gte,
  lt,
  lte,
  float,
  integer,
  number,
  price,
  cgt,
  cgte,
  clt,
  clte,
  wgt,
  wgte,
  wlt,
  wlte,
  cc,
  email,
  hex,
  color,
  url
};

export default validators;
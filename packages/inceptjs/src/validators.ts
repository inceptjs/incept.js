const safeValue = (value: any) => required(value) ? value: '';

//general
export const eq = (value: any, compare: any) => value == compare;
export const ne = (value: any, compare: any) => value != compare;
export const notempty = (value: any) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  if (typeof value === 'number') return value !== 0;
  return safeValue(value).toString().length > 0;
};
export const option = (value: any, options: any[]) => options.includes(value);
export const regex = (value: string|number, regex: string|RegExp) => new RegExp(regex).test(safeValue(value).toString());
export const required = (value: any) => value !== null && typeof value !== 'undefined';
//date
export const date = (value: any) => regex(value, /^\d{4}-\d{2}-\d{2}$/);
export const datetime = (value: any) => regex(value, /^\d{4}(\-\d{2}){2}(T|\s){1}\d{2}(:\d{2}){1,2}(\.\d{3}){0,1}Z{0,1}$/);
export const time = (value: any) => regex(value, /^\d{2}:\d{2}(:\d{2})*$/);
export const future = (value: any) => new Date(value || 0) > new Date();
export const past = (value: any) => new Date(value || 0) < new Date();
export const present = (value: any) => new Date(value || 0).toDateString() === new Date().toDateString();
//number
export const gt = (value: number|string, compare: number) => (Number(value) || 0) > compare;
export const ge = (value: number|string, compare: number) => (Number(value) || 0) >= compare;
export const lt = (value: number|string, compare: number) => (Number(value) || 0) < compare;
export const le = (value: number|string, compare: number) => (Number(value) || 0) <= compare;
export const float = (value: any) => regex(value, /^\d+\.\d+$/);
export const integer = (value: any) => regex(value, /^\d+$/);
export const number = (value: any) => regex(value, /^\d+(\.\d+)*$/);
export const price = (value: any) => regex(value, /^\d+(\.\d{2})*$/);
//string
export const ceq = (value: string|number, compare: number) => eq(safeValue(value).toString().length, compare);
export const cgt = (value: string|number, compare: number) => gt(safeValue(value).toString().length, compare);
export const cge = (value: string|number, compare: number) => ge(safeValue(value).toString().length, compare);
export const clt = (value: string|number, compare: number) => lt(safeValue(value).toString().length, compare);
export const cle = (value: string|number, compare: number) => le(safeValue(value).toString().length, compare);
export const wgt = (value: string|number, compare: number) => gt(safeValue(value).toString().split(' ').length, compare);
export const wge = (value: string|number, compare: number) => ge(safeValue(value).toString().split(' ').length, compare);
export const wlt = (value: string|number, compare: number) => lt(safeValue(value).toString().split(' ').length, compare);
export const wle = (value: string|number, compare: number) => le(safeValue(value).toString().split(' ').length, compare);
//type
export const cc = (value: string) => regex(value, /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
export const email = (value: string) => regex(value, /^(?:(?:(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff]))(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff]|\x5c(?=[@,"\[\]\x5c\x00-\x20\x7f-\xff])|\.(?=[^\.])){1,62}(?:[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]|(?<=\x5c)[@,"\[\]\x5c\x00-\x20\x7f-\xff])|[^@,"\[\]\x5c\x00-\x20\x7f-\xff\.]{1,2})|"(?:[^"]|(?<=\x5c)"){1,62}")@(?:(?!.{64})(?:[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.?|[a-zA-Z0-9]\.?)+\.(?:xn--[a-zA-Z0-9]+|[a-zA-Z]{2,6})|\[(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])(?:\.(?:[0-1]?\d?\d|2[0-4]\d|25[0-5])){3}\])$/);
export const hex = (value: string) => regex(value, /^[a-f0-9]+$/);
export const color = (value: string) => regex(value, /^#?([a-f0-9]{6}|[a-f0-9]{3})$/);
export const url = (value: string) => regex(value,/^(http|https|ftp):\/\/([A-Z0-9][A-Z0-9_-]*(?:.[A-Z0-9][A-Z0-9_-]*)+):?(d+)?\/?/i);

const validators = {
  eq,
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
  ge,
  lt,
  le,
  float,
  integer,
  number,
  price,
  ceq,
  cgt,
  cge,
  clt,
  cle,
  wgt,
  wge,
  wlt,
  wle,
  cc,
  email,
  hex,
  color,
  url
};

export default validators;
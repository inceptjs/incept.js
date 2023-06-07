export type Field = {
  type: string,
  length?: number,
  attribute?: string,
  default?: string|number,
  nullable?: boolean,
  unsigned?: boolean,
  autoIncrement?: boolean,
  comment?: string  
}

export type Relation = { 
  type: string, 
  table: string, 
  as: string, 
  from: string, 
  to: string 
};

export type AlterFields = {
  add: Record<string, Field>,
  update: Record<string, Field>,
  remove: string[]
};

export type AlterKeys = {
  add: Record<string, string[]>,
  remove: string[]
};

export type AlterUnqiues = {
  add: Record<string, string[]>,
  remove: string[]
};

export type AlterPrimaries = {
  add: string[],
  remove: string[]
};
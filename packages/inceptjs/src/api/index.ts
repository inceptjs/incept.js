import type { 
  FieldsetConfig,
  FieldsetColumn,
  SchemaConfig,
  SchemaColumn, 
  SchemaColumnData,
  FieldMethod, 
  FormatMethod, 
  ColumnFieldOption,
  ColumnValidationOption,
  ColumnFormatOption
} from '../types';

import validators from '../validators';

import dataFields from './fields.json';
import dataFormats from './formats.json';
import dataValidators from './validators.json';

export * from '../types';

export const data = {
  fields: dataFields as Record<string, Record<string, ColumnFieldOption>>,
  validators: dataValidators as Record<string, Record<string, ColumnValidationOption>>,
  formats: dataFormats as Record<string, Record<string, ColumnFormatOption>>
};

const get = <Options>(
  options: 'fields'|'validators'|'formats', 
  filter: string[] = [], 
  flat = false
) => {
  //if no filters include all fields
  if (!filter.length) {
    filter = Object
      .keys(data[options])
      .map(group => Object.keys(data[options][group]))
      .flat(1);
  }
  //filter fields
  const filtered: Record<string, Record<string, Options>> = {};
  for (const group in data[options]) {
    for (const option in data[options][group]) {
      if (filter.includes(option)) {
        if (!filtered[group]) {
          filtered[group] = {};
        }
        filtered[group][option] = data[options][group][option] as Options;
      }
    }
  }
  //if flat, de-group results
  if (flat) {
    const flat: Record<string, Options> = {};
    for (const group in filtered) {
      for (const option in filtered[group]) {
        flat[option] = filtered[group][option];
      }
    }
    return flat;
  }
  //otherwise return grouped results
  return filtered;
}

export const api = {
  field: {
    get: (name: string) => {
      return api.field.list([name])[name] as ColumnFieldOption|undefined;
    },
    list: (filter: string[] = []) => {
      return get<ColumnFieldOption>('fields', filter, true) as Record<string, ColumnFieldOption>;
    },
    groups: (filter: string[] = []) => {
      return get<ColumnFieldOption>('fields', filter, false) as Record<string, Record<string, ColumnFieldOption>>;
    }
  },
  validator: {
    get: (name: string) => {
      return api.validator.list([name])[name] as ColumnValidationOption|undefined;
    },
    list:(filter: string[] = []) => {
      return get<ColumnValidationOption>('validators', filter, true) as Record<string, ColumnValidationOption>;
    },
    groups:(filter: string[] = []) => {
      return get<ColumnValidationOption>('validators', filter, false) as Record<string, Record<string, ColumnValidationOption>>;
    },
  },
  format: {
    get: (name: string) => {
      return api.format.list([name])[name] as ColumnFormatOption|undefined;
    },
    list: (filter: string[] = []) => {
      return get<ColumnFormatOption>('formats', filter, true) as Record<string, ColumnFormatOption>;
    },
    groups: (filter: string[] = []) => {
      return get<ColumnFormatOption>('formats', filter, false) as Record<string, Record<string, ColumnFormatOption>>;
    },
  },
  schema: {
    //types: string, text, string|number, string[], number, integer, 
    //       float, boolean, date, datetime, time, object, hash, hash[]
    // number = integer|float
    // hash = {string:string}
    // hash[] = {string:string}[]
    data: (column: Partial<SchemaColumn>) => {
      if (!column.field || !column.validation) return;
      
      const field = api.field.get(column.field?.method || '');
    
      const flags = {
        req: !!column.validation.filter(validator => validator.method === 'required').length,
        uni: !!column.validation.filter(validator => validator.method === 'unique').length
      };
      const conditions = {
        lt: parseFloat(column.validation.filter(validator => validator.method === 'lt')[0]?.parameters[0]) || undefined,
        le: parseFloat(column.validation.filter(validator => validator.method === 'le')[0]?.parameters[0]) || undefined,
        gt: parseFloat(column.validation.filter(validator => validator.method === 'gt')[0]?.parameters[0]) || undefined,
        ge: parseFloat(column.validation.filter(validator => validator.method === 'ge')[0]?.parameters[0]) || undefined,
        ceq: parseFloat(column.validation.filter(validator => validator.method === 'ceq')[0]?.parameters[0]) || undefined,
        clt: parseFloat(column.validation.filter(validator => validator.method === 'clt')[0]?.parameters[0]) || undefined,
        cle: parseFloat(column.validation.filter(validator => validator.method === 'cle')[0]?.parameters[0]) || undefined,
        cgt: parseFloat(column.validation.filter(validator => validator.method === 'cgt')[0]?.parameters[0]) || undefined,
        cge: parseFloat(column.validation.filter(validator => validator.method === 'cge')[0]?.parameters[0]) || undefined,
        min: parseFloat(column.field.attributes.min) || undefined,
        max: parseFloat(column.field.attributes.max) || undefined,
        step: parseFloat(column.field.attributes.step) || undefined,
      };

      const lengths: Record<string, [string, string]> = Object.fromEntries(
        Object
          .entries(conditions)
          .filter(entry => typeof entry[1] === 'number')
          .map(([key, value]) => [ key, String(value).split('.', 2) ])
          .map(([key, value]) => [ key, [ value[0] || '', value[1] || '' ] ])
      );

      let length = Object
        .values(lengths)
        .concat([['0', '0']])
        .reduce((last, current) => [
          last[0].length > current[0].length ? last[0] : current[0],
          last[1].length > current[1].length ? last[1] : current[1],
        ]).map(value => value.length) as [number, number];
      
      const unsigned = !(
        (typeof conditions.min === 'number' && conditions.min < 0)
          || (typeof conditions.max === 'number' && conditions.max < 0)
          || (typeof conditions.lt === 'number' && conditions.lt < 0)
          || (typeof conditions.le === 'number' && conditions.le < 0)
          || (typeof conditions.gt === 'number' && conditions.gt < 0)
          || (typeof conditions.ge === 'number' && conditions.ge < 0)
      );
    
      let variable = !conditions.ceq;
    
      let inferred = 'varchar';
      if (column.field?.attributes?.type === 'number') {
        inferred = length[1] > 0 ? 'float' : 'int';
      }

      switch (column.default) {
        case 'now()':
        case 'updated()':
          inferred = 'datetime';
          break;
        case 'nanoid()':
          inferred = 'char';
          length = [ 21, 0 ];
          break;
        case 'cuid()':
          inferred = 'char';
          length = [ 25, 0 ];
          break;
        case 'cuid2()':
          inferred = 'char';
          length = [ 24, 0 ];
          break;
        case 'increment()':
          inferred = 'integer';
          length = [ 10, 0 ];
      }

      const data: Partial<SchemaColumnData> = {
        required: flags.req,
        primary: !!column.data?.primary,
        unique: flags.uni,
        unsigned
      };

      if (field?.data.type.default) {
        data.type = field.data.type.default;
      } else {
        switch (column.type || field?.column?.type) {
          case 'string':
            data.type = variable ? 'varchar': 'char';
            break;
          case 'string|number':
            data.type = inferred;
            break;
          case 'number':
            data.type = inferred !== 'varchar' ? inferred : 'float';
            break;
          case 'int':
          case 'integer':
            data.type = 'int';
            break;
          case 'float':
            data.type = 'float';
            break;
          case 'text':
          case 'boolean':
          case 'date':
          case 'datetime':
          case 'time':
            data.type = column.type;
            break;
          case 'string[]':
          case 'hash':
          case 'hash[]':
          case 'object':
            data.type = 'json';
            break;
          default:
            data.type = 'varchar';
            break;
        }
      }
      if (field?.data.length.default) {
        data.length = field.data.length.default;
      } else {
        switch (data.type) {
          case 'varchar':
          case 'char':
            data.length = length[0] > 0 ? length[0] : 255;
            break;
          case 'int':
            data.length = length[0] > 0 ? length[0] : 10;
            break;
          case 'float':
            data.length = length[1] 
              ? [length[0] + length[1], length[1]]  
              : length[0] 
              ? [ length[0], 0 ]
              : [ 10, 2 ];
            break;
          case 'text':
          case 'boolean':
          case 'date':
          case 'datetime':
          case 'time':
          case 'json':
            break;
        }
      }
    
      return data;
    },
    defaults: (field: string, column: Partial<SchemaColumn> = {}) => {
      const selected = api.field.get(field);
      if (!selected) return;
      const list = api.format.get(selected.display.list.default || 'none');
      const view = api.format.get(selected.display.view.default || 'none');
      const defaults = {
        ...column,
        type: selected.column.type,
        name: selected.column.name.default || column.name,
        label: selected.column.label.default || column.label,
        field: {
          method: selected.method as FieldMethod,
          attributes: Object.assign({},
            selected?.attributes.fixed || {},
          )
        },
        validation: [],
        list: {
          method: (list?.method || 'none') as FormatMethod,
          attributes: Object.assign({}, 
            list?.attributes.default || {}, 
            list?.attributes.fixed || {}
          ) || {}
        },
        view: {
          method: (view?.method || 'none') as FormatMethod,
          attributes: Object.assign({}, 
            view?.attributes.default || {}, 
            view?.attributes.fixed || {}
          ) || {}
        },
        default: selected.default.default,
        searchable: selected.display.searchable.default,
        filterable: selected.display.filterable.default,
        sortable: selected.display.sortable.default
      } as SchemaColumn;

      if (!defaults.data) {
        const data = {
          ...(api.schema.data(defaults) || {}),
          primary: selected.data.primary.default
        };
        if (data) {
          defaults.data = data as SchemaColumnData;
        }
      }

      return defaults;
    },
    type: (column: Partial<SchemaColumn>) => {
      const data = api.schema.data(column) as SchemaColumnData;
      switch (data.type) {
        case 'boolean':
          return 'boolean';
        case 'int':
        case 'float':
          return 'number';
        case 'date':
        case 'datetime':
        case 'time':
          return 'date';
        case 'char':
        case 'varchar':
        case 'text':
          return 'string';
      }

      return column.type || 'string';
    }
  },
  fieldset: {
    defaults: (field: string, column: Partial<FieldsetColumn> = {}) => {
      const selected = api.field.get(field);
      if (!selected) return;
      const list = api.format.get(selected.display.list.default || 'none');
      const view = api.format.get(selected.display.view.default || 'none');
      return {
        ...column,
        type: selected.column.type,
        name: selected.column.name.default || column.name,
        label: selected.column.label.default || column.label,
        field: {
          method: selected.method as FieldMethod,
          attributes: Object.assign({},
            selected?.attributes.fixed || {},
          )
        },
        validation: [],
        list: {
          method: (list?.method || 'none') as FormatMethod,
          attributes: Object.assign({}, 
            list?.attributes.default || {}, 
            list?.attributes.fixed || {}
          ) || {}
        },
        view: {
          method: (view?.method || 'none') as FormatMethod,
          attributes: Object.assign({}, 
            view?.attributes.default || {}, 
            view?.attributes.fixed || {}
          ) || {}
        },
        default: selected.default.default
      } as FieldsetColumn;
    }
  },
  validate: {
    schema: (data: Partial<SchemaConfig>, strict = true) => {
      const errors: Record<string, any> = {};
      if (strict && !validators.required(data.name)) {
        errors.name = 'Name is required';
      }
      if (strict && !validators.required(data.singular)) {
        errors.singular = 'Singular is required';
      }
      if (strict && !validators.required(data.plural)) {
        errors.plural = 'Plural is required';
      }
      if (!data.columns?.length) {
        errors.columns = 'Must have at least one column';
      } else {
        errors.columns = {} as Record<number, Record<string, string>>;
        data.columns.forEach((column, index) => {
          const error = api.validate.column(column);
          if (Object.keys(error).length) {
            errors.columns[index] = error;
          }
        });
        if (!Object.keys(errors.columns).length) {
          delete errors.columns;
        }
      }
      return errors;
    },
    fieldset: (data: Partial<FieldsetConfig>, strict = true) => {
      const errors: Record<string, any> = {};
      if (strict && !validators.required(data.name)) {
        errors.name = 'Name is required';
      }
      if (strict && !validators.required(data.singular)) {
        errors.singular = 'Singular is required';
      }
      if (strict && !validators.required(data.plural)) {
        errors.plural = 'Plural is required';
      }
      if (!data.columns?.length) {
        errors.columns = 'Must have at least one column';
      } else {
        errors.columns = {} as Record<number, Record<string, string>>;
        data.columns.forEach((column, index) => {
          const error = api.validate.column(column);
          if (Object.keys(error).length) {
            errors.columns[index] = error;
          }
        });
        if (!Object.keys(errors.columns).length) {
          delete errors.columns;
        }
      }
      return errors;
    },
    column: (column: Partial<FieldsetColumn>) => {
      const errors: Record<string, string> = {};
      if (!validators.required(column.name)) {
        errors.name = 'Name is required';
      }
      if (!validators.required(column.label)) {
        errors.label = 'Label is required';
      }
    
      return errors;
    }
  }
};

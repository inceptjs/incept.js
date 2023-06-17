import type { 
  SchemaColumn, 
  FieldMethod, 
  FormatMethod, 
  SchemaColumnData 
} from 'inceptjs';

export type FieldOption = { 
  type: string,
  method: string,
  label: string,
  content?: {
    name: string,
    label: string
  }
  component: string|false, 
  attributes: {
    show: boolean,
    fixed: Record<string, any>,
    default: Record<string, any>
  }, 
  params: {
    field: string,
    attribute: string,
    attributes: Record<string, any>
  }[],
  searchable: { show: boolean, default: boolean },
  filterable: { show: boolean, default: boolean },
  sortable: { show: boolean, default: boolean },
  validation: { show: boolean, filter: string[]|false },
  list: { show: boolean, filter: string[]|false, default: string|undefined },
  view: { show: boolean, filter: string[]|false, default: string|undefined },
  default: { show: boolean, default: string|number|undefined },
  enabled: boolean
};

export type ValidationOption = { 
  method: string,
  label: string,
  params: {
    field: string,
    attributes?: Record<string, any>
  }[],
  enabled: boolean
};

export type FormatOption = { 
  method: string,
  label: string,
  component: string|false, 
  attributes: {
    show: boolean,
    fixed: Record<string, any>,
    default: Record<string, any>
  },  
  params: {
    field: string,
    attribute: string,
    attributes: Record<string, any>
  }[],
  enabled: boolean
};

export const validators: Record<string, Record<string, ValidationOption>> = {
  'General': {
    required: {
      method: 'required',
      label: 'Required',
      params: [],
      enabled: true
    },
    unique: {
      method: 'unique',
      label: 'Unique',
      params: [],
      enabled: true
    },
    notempty: {
      method: 'notempty',
      label: 'Not Empty',
      params: [],
      enabled: true
    },
    ne: {
      method: 'ne',
      label: 'Not Equal',
      params: [
        {
          field: 'text',
          attributes: {
            type: 'text',
            placeholder: 'Enter Value'
          }
        }
      ],
      enabled: true
    },
    option: {
      method: 'option',
      label: 'Valid Option',
      params: [
        {
          field: 'textlist',
          attributes: {
            label: 'Add Option'
          }
        }
      ],
      enabled: true
    }
  },
  'Strings': {
    ceq: {
      method: 'ceq',
      label: 'Characters Equal To',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    cgt: {
      method: 'cgt',
      label: 'Characters Greater Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    cge: {
      method: 'cge',
      label: 'Characters Greater Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    clt: {
      method: 'clt',
      label: 'Characters Less Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    cle: {
      method: 'cle',
      label: 'Characters Less Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    wgt: {
      method: 'wgt',
      label: 'Words Greater Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    wge: {
      method: 'wge',
      label: 'Words Greater Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    wlt: {
      method: 'wlt',
      label: 'Words Less Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    wle: {
      method: 'wle',
      label: 'Words Less Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    }
  },
  'Numbers': {
    float: {
      method: 'float',
      label: 'Valid Float',
      params: [],
      enabled: true
    },
    integer: {
      method: 'integer',
      label: 'Valid Integer',
      params: [],
      enabled: true
    },
    number: {
      method: 'number',
      label: 'Valid Number',
      params: [],
      enabled: true
    },
    price: {
      method: 'price',
      label: 'Valid Price',
      params: [],
      enabled: true
    },
    gt: {
      method: 'gt',
      label: 'Greater Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    ge: {
      method: 'ge',
      label: 'Greater Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    lt: {
      method: 'lt',
      label: 'Less Than',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    },
    le: {
      method: 'le',
      label: 'Less Than Equal',
      params: [
        {
          field: 'number',
          attributes: {
            min: 0,
            placeholder: 'Enter Number'
          }
        }
      ],
      enabled: true
    }
  },
  'Date': {
    date: {
      method: 'date',
      label: 'Valid Date',
      params: [],
      enabled: true
    },
    time: {
      method: 'time',
      label: 'Valid Time',
      params: [],
      enabled: true
    },
    datetime: {
      method: 'datetime',
      label: 'Valid Datetime',
      params: [],
      enabled: true
    },
    past: {
      method: 'past',
      label: 'Valid Past Date',
      params: [],
      enabled: true
    },
    present: {
      method: 'present',
      label: 'Valid Present Date',
      params: [],
      enabled: true
    },
    future: {
      method: 'future',
      label: 'Valid Future Date',
      params: [],
      enabled: true
    }
  },
  'Type': {
    color: {
      method: 'color',
      label: 'Valid Color',
      params: [],
      enabled: true
    },
    email: {
      method: 'email',
      label: 'Valid Email',
      params: [],
      enabled: true
    },
    url: {
      method: 'url',
      label: 'Valid URL',
      params: [],
      enabled: true
    },
    hex: {
      method: 'hex',
      label: 'Valid Hex',
      params: [],
      enabled: true
    },
    cc: {
      method: 'cc',
      label: 'Valid Credit Card',
      params: [],
      enabled: true
    }
  },
  '---------------': {
    regexp: {
      method: 'regexp',
      label: 'Valid Expression',
      params: [
        {
          field: 'text',
          attributes: {
            type: 'text',
            placeholder: 'Enter Expression e.g. ^[a-zA-Z0-9]+$'
          }
        }
      ],
      enabled: true
    }
  }
};

export const formats: Record<string, Record<string, FormatOption>> = {
  '': {
    none: {
      method: 'none',
      label: 'No Filter',
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      }, 
      params: [],
      enabled: true
    }
  },
  'Strings': {
    lower: {
      method: 'lower',
      label: 'Lowercase',
      component: 'FormatText',
      attributes: {
        show: false,
        fixed: { format: 'lowercase' },
        default: {}
      }, 
      params: [],
      enabled: true
    },
    upper: {
      method: 'upper',
      label: 'Uppercase',
      component: 'FormatText',
      attributes: {
        show: false,
        fixed: { format: 'uppercase' },
        default: {}
      },
      params: [],
      enabled: true
    },
    capital: {
      method: 'capital',
      label: 'Capitalized',
      component: 'FormatText',
      attributes: {
        show: false,
        fixed: { format: 'capitalize' },
        default: {}
      },
      params: [],
      enabled: true
    },
    char: {
      method: 'char',
      label: 'Character Length',
      component: 'FormatOverflow',
      attributes: {
        show: false,
        fixed: { hellip: true },
        default: {}
      },
      params: [
        {
          field: 'number',
          attribute: 'length',
          attributes: { 
            min: 1, 
            step: 1,
            placeholder: 'Enter Number Length'
          }
        }
      ],
      enabled: true
    },
    word: {
      method: 'word',
      label: 'Word Length',
      component: 'FormatOverflow',
      attributes: {
        show: false,
        fixed: { word: true, hellip: true },
        default: {}
      },
      params: [
        {
          field: 'number',
          attribute: 'length',
          attributes: { 
            min: 1, 
            step: 1,
            placeholder: 'Enter Number Length'
          }
        }
      ],
      enabled: true
    }
  },
  'Numbers': {
    number: {
      method: 'number',
      label: 'Number',
      component: 'FormatNumber',
      attributes: {
        show: false,
        fixed: {},
        default: {
          separator: ',',
          decimal: '.'
        }
      },
      params: [],
      enabled: true
    },
    price: {
      method: 'price',
      label: 'Price',
      component: 'FormatNumber',
      attributes: {
        show: false,
        fixed: { decimals: 2 },
        default: {
          separator: ',',
          decimal: '.'
        }
      },
      params: [],
      enabled: true
    },
    yesno: {
      method: 'yesno',
      label: 'Yes/No',
      component: 'FormatYesno',
      attributes: {
        show: false,
        fixed: {},
        default: {
          yes: 'Yes',
          no: 'No'
        }
      },
      params: [],
      enabled: true
    },
    rating: {
      method: 'rating',
      label: 'Star Rating',
      component: 'FormatRating',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    }
  },
  'Dates': {
    date: {
      method: 'date',
      label: 'Date',
      component: 'FormatDate',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    relative: {
      method: 'relative',
      label: 'Relative Date',
      component: 'FormatDate',
      attributes: {
        show: true,
        fixed: { format: 'ago' },
        default: {}
      },
      params: [],
      enabled: true
    },
    rel: {
      method: 'rel',
      label: 'Short Relative Date',
      component: 'FormatDate',
      attributes: {
        show: true,
        fixed: { format: 'a' },
        default: {}
      },
      params: [],
      enabled: true
    }
  },
  'HTML': {
    html: {
      method: 'html',
      label: 'Raw HTML',
      component: 'FormatHTML',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    escaped: {
      method: 'escaped',
      label: 'Escaped HTML',
      component: false,
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    markdown: {
      method: 'markdown',
      label: 'Markdown',
      component: 'FormatMarkdown',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    color: {
      method: 'color',
      label: 'Color',
      component: 'FormatColor',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    link: {
      method: 'link',
      label: 'Link',
      component: 'FormatLink',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    image: {
      method: 'image',
      label: 'Image',
      component: 'FormatImage',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    email: {
      method: 'email',
      label: 'Email Address',
      component: 'FormatEmail',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    phone: {
      method: 'phone',
      label: 'Phone Number',
      component: 'FormatPhone',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    }
  },
  'JSON': {
    space: {
      method: 'space',
      label: 'Space Separated',
      component: 'FormatSeparated',
      attributes: {
        show: true,
        fixed: { separator: ' ' },
        default: {}
      },
      params: [],
      enabled: true
    },
    comma: {
      method: 'comma',
      label: 'Comma Separated',
      component: false,
      attributes: {
        show: true,
        fixed: { separator: ', ' },
        default: {}
      },
      params: [],
      enabled: true
    },
    line: {
      method: 'line',
      label: 'Line Separated',
      component: false,
      attributes: {
        show: true,
        fixed: { separator: 'line' },
        default: {}
      },
      params: [],
      enabled: true
    },
    ol: {
      method: 'ol',
      label: 'Ordered List',
      component: 'FormatList',
      attributes: {
        show: true,
        fixed: { ordered: true },
        default: {}
      },
      params: [],
      enabled: true
    },
    ul: {
      method: 'ul',
      label: 'Unordered List',
      component: 'FormatList',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    taglist: {
      method: 'taglist',
      label: 'Taglist',
      component: 'FormatTaglist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    metadata: {
      method: 'metadata',
      label: 'Metadata (key: val)',
      component: 'FormatMetadata',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    table: {
      method: 'table',
      label: 'Table',
      component: 'FormatTable',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    carousel: {
      method: 'carousel',
      label: 'Image Carousel',
      component: 'FormatImagelist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    pretty: {
      method: 'pretty',
      label: 'JSON Pretty',
      component: 'FormatJSON',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    }
  },
  '---------------': {
    hide: {
      method: 'hide',
      label: 'Do Not Show',
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      enabled: true
    },
    custom: {
      method: 'custom',
      label: 'Custom Format',
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'text',
          attribute: 'custom',
          attributes: {}
        }
      ],
      enabled: false
    },
    formula: {
      method: 'formula',
      label: 'Formula',
      component: 'FormatFormula',
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'text',
          attribute: 'formula',
          attributes: { placeholder: 'Enter a formula' }
        }
      ],
      enabled: true
    }
  }
};

export const fields: Record<string, Record<string, FieldOption>> = {
  '': {
    none: {
      type: 'string|number',
      method: 'none',
      label: 'No Field',
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { show: false, filter: false },
      list: { show: true, filter: false, default: undefined },
      view: { show: true, filter: false, default: undefined },
      default: { show: true, default: undefined },
      enabled: true
    }
  },
  'Strings': {
    color: {
      type: 'string',
      method: 'color',
      label: 'Color Field',
      component: 'FieldColor',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 
          'option',   'ne',     'ceq', 'cgt', 
          'cge',      'clt',    'cle',
          'color',    'hex',    'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'lower', 'upper', 'capital', 
          'char', 'color', 'hide',  'custom'
        ], 
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'lower', 'upper', 'capital', 
          'char', 'color', 'hide',  'custom'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    email: {
      type: 'string',
      method: 'email',
      label: 'Email Field',
      component: 'FieldInput',
      attributes: {
        show: true,
        fixed: { type: 'email' },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 
          'option',   'ne',     'ceq', 'cgt', 
          'cge',      'clt',    'cle',
          'email',    'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'lower', 'upper', 
          'capital', 'char',  'email', 
          'link',    'hide',  'custom'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'lower', 'upper', 
          'capital', 'char',  'email', 
          'link',    'hide',  'custom'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    input: {
      type: 'string|number',
      method: 'input',
      label: 'Input Field',
      component: 'FieldInput',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    mask: {
      type: 'string',
      method: 'mask',
      label: 'Input Mask',
      component: 'FieldMask',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'text',
          attribute: 'mask',
          attributes: {
            placeholder: 'eg. 999-999-999'
          }
        }
      ],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    phone: {
      type: 'string',
      method: 'phone',
      label: 'Phone Field',
      component: 'FieldInput',
      attributes: {
        show: true,
        fixed: { type: 'phone' },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 
          'option',   'ne',     'ceq', 'cgt', 
          'cge',      'clt',    'cle',
          'integer',  'number', 'gt',
          'ge',       'lt',     'le',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',  'char', 'email', 'number', 
          'phone', 'link', 'hide',  'custom'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',  'char', 'email', 'number', 
          'phone', 'link', 'hide',  'custom'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    password: {
      type: 'string',
      method: 'password',
      label: 'Password Field',
      component: 'FieldPassword',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 
          'option',   'ne',      'ceq', 'cgt',     
          'cge',      'clt',     'cle',
          'wgt',     'wge',      'wlt',
          'wle',      'cc',      'regexp'
        ]
      },
      list: { 
        show: false, 
        filter: false,
        default: 'hide'
      },
      view: { 
        show: false, 
        filter: false,
        default: 'hide'
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    slug: {
      type: 'string',
      method: 'slug',
      label: 'Slug Field',
      component: 'FieldSlug',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'option',
          'ne',       'cgt',
          'cge',      'clt',
          'cle',      'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'lower',  'upper', 
          'capital', 'char',   'link',
          'hide',    'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'lower',  'upper', 
          'capital', 'char',   'link',
          'hide',    'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    text: {
      type: 'string',
      method: 'text',
      label: 'Text Field',
      component: 'FieldInput',
      attributes: {
        show: true,
        fixed: { type: 'text' },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    url: {
      type: 'string',
      method: 'url',
      label: 'URL Field',
      component: 'FieldInput',
      attributes: {
        show: true,
        fixed: { type: 'url' },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 'option',   
          'ne',       'ceq', 'cgt',    'cge',      'clt',
          'cle',      'url',    'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
  },
  'Editors': {
    code: {
      type: 'text',
      method: 'code',
      label: 'Code Editor',
      component: 'FieldCodeEditor',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    markdown: {
      type: 'text',
      method: 'markdown',
      label: 'Markdown Editor',
      component: 'FieldMarkdown',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    textarea: {
      type: 'text',
      method: 'textarea',
      label: 'Textarea',
      component: 'FieldTextarea',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    wysiwyg: {
      type: 'text',
      method: 'wysiwyg',
      label: 'WYSIWYG Editor',
      component: 'FieldWysiwyg',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',    'word', 
          'html', 'escaped', 'markdown',
          'hide', 'custom',  'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    }
  },
  'Numbers': {
    integer: {
      type: 'integer',
      method: 'integer',
      label: 'Integer Field',
      component: 'FieldNumber',
      attributes: {
        show: true,
        fixed: { step: 1 },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'float',   'integer',  'number',
          'price',    'gt',      'ge',       'lt',
          'le',       'date',    'datetime', 'time',
          'past',     'present', 'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    number: {
      type: 'number',
      method: 'number',
      label: 'Number Field',
      component: 'FieldNumber',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'float',   'integer',  'number',
          'price',    'gt',      'ge',       'lt',
          'le',       'date',    'datetime', 'time',
          'past',     'present', 'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    price: {
      type: 'float',
      method: 'price',
      label: 'Price Field',
      component: 'FieldNumber',
      attributes: {
        show: true,
        fixed: { step: 0.01 },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'float',   'integer',  'number',
          'price',    'gt',      'ge',       'lt',
          'le',       'date',    'datetime', 'time',
          'past',     'present', 'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    range: {
      type: 'number',
      method: 'range',
      label: 'Range Field',
      component: 'FieldRange',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'float',   'integer',  'number',
          'price',    'gt',      'ge',       'lt',
          'le',       'date',    'datetime', 'time',
          'past',     'present', 'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'number', 'price',  
          'yesno',    'rating', 'date',   
          'relative', 'rel',    'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    rating: {
      type: 'number',
      method: 'rating',
      label: 'Rating Field',
      component: 'FieldRating',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'float',   'integer',  'number',
          'price',    'gt',      'ge',       'lt',
          'le',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',   'number', 'price',  'yesno',
          'rating', 'hide',   'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',   'number', 'price',  'yesno',
          'rating', 'hide',   'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    small: {
      type: 'integer',
      method: 'small',
      label: 'Small Field',
      component: 'FieldNumber',
      attributes: {
        show: true,
        fixed: { min: 0, max: 9, step: 1 },
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 
          'option',   'ne',     'integer', 
          'gt',       'ge',     'lt',
          'le',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'number', 'rating',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'number', 'rating',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    }
  },
  'Dates': {
    date: {
      type: 'date',
      method: 'date',
      label: 'Date Field',
      component: 'FieldDate',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'integer', 'number',   'gt',
          'ge',       'lt',      'le',       'date',
          'datetime', 'time',    'past',     'present',  
          'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    datetime: {
      type: 'datetime',
      method: 'datetime',
      label: 'Datetime Field',
      component: 'FieldDatetime',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'integer', 'number',   'gt',
          'ge',       'lt',      'le',       'date',
          'datetime', 'time',    'past',     'present',  
          'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    time: {
      type: 'time',
      method: 'time',
      label: 'Time Field',
      component: 'FieldTime',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'integer', 'number',   'gt',
          'ge',       'lt',      'le',       'date',
          'datetime', 'time',    'past',     'present',  
          'future',   'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'lower',    'upper', 
          'capital', 'char',     'number',   
          'date',    'relative', 'rel',
          'hide',    'custom',   'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    }
  },
  'Options': {
    autocomplete: {
      type: 'string',
      method: 'autocomplete',
      label: 'Autocomplete Field',
      component: 'FieldAutocomplete',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    checkbox: {
      type: 'boolean',
      method: 'checkbox',
      label: 'Checkbox Field',
      component: 'FieldCheckbox',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 
          'notempty', 
          'option',
          'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    checklist: {
      type: 'string[]',
      method: 'checklist',
      label: 'Checklist',
      component: 'FieldChecklist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'metadata',
          attribute: 'options',
          attributes: {}
        }
      ],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    country: {
      type: 'string',
      method: 'country',
      label: 'Country Field',
      component: 'FieldCountry',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 
          'notempty', 'option',
          'ne',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',  'lower',
          'upper', 'capital',  
          'char',  'word', 
          'hide',  'custom'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',  'lower',
          'upper', 'capital',  
          'char',  'word', 
          'hide',  'custom'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    currency: {
      type: 'string',
      method: 'currency',
      label: 'Currency Field',
      component: 'FieldCurrency',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 
          'notempty', 'option',
          'ne',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',  'lower',
          'upper', 'capital',  
          'char',  'word', 
          'hide',  'custom'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',  'lower',
          'upper', 'capital',  
          'char',  'word', 
          'hide',  'custom'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    radio: {
      type: 'string|number',
      method: 'radio',
      label: 'Radiolist Field',
      component: 'FieldRadio',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'metadata',
          attribute: 'options',
          attributes: {}
        }
      ],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    select: {
      type: 'string|number',
      method: 'select',
      label: 'Select Field',
      component: 'FieldSelect',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'metadata',
          attribute: 'options',
          attributes: {
            label: 'Add Option'
          }
        }
      ],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',  'notempty', 'option',   
          'ne',       'ceq', 'cgt',     'cge',      'clt',
          'cle',      'wgt',     'wge',      'wlt',
          'wle',      'email',   'float',    'integer',  
          'number',   'price',   'gt',       'ge',
          'lt',       'le',      'date',     'datetime', 
          'time',     'past',    'present',  'future',
          'color',    'email',   'url',      'hex',
          'cc',       'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',     'lower',  'upper', 
          'capital',  'char',   'word', 
          'number',   'price',  'yesno',
          'rating',   'date',   'relative', 
          'rel',      'html',   'escaped',  
          'markdown', 'color',  'link',
          'image',    'email',  'phone',
          'hide',     'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    selectlist: {
      type: 'string[]',
      method: 'selectlist',
      label: 'Multi Select Field',
      component: 'FieldSelectlist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'metadata',
          attribute: 'options',
          attributes: {}
        }
      ],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    switch: {
      type: 'boolean',
      method: 'switch',
      label: 'Switch Field',
      component: 'FieldSwitch',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 
          'notempty', 
          'option',
          'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    }
  },
  'Files': {
    file: {
      type: 'string',
      method: 'file',
      label: 'File Field',
      component: 'FieldFile',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 'option',   
          'ne',       'ceq', 'cgt',    'cge',      'clt',
          'cle',      'url',    'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    filelist: {
      type: 'string[]',
      method: 'filelist',
      label: 'Filelist Field',
      component: 'FieldFilelist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    image: {
      type: 'string',
      method: 'image',
      label: 'Image Field',
      component: 'FieldImage',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique', 'notempty', 'option',   
          'ne',       'ceq', 'cgt',    'cge',      'clt',
          'cle',      'url',    'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'lower',  'upper', 
          'char', 'link',   'image',
          'hide', 'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    imagelist: {
      type: 'string[]',
      method: 'imagelist',
      label: 'Imagelist Field',
      component: 'FieldImagelist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    }
  },
  'JSON': {
    json: {
      type: 'object',
      method: 'json',
      label: 'JSON Field',
      component: 'FieldJSON',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'table',   'pretty',   'hide',
          'custom',  'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'table',   'pretty',   'hide',
          'custom',  'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    metadata: {
      type: 'hash',
      method: 'metadata',
      label: 'Metadata Fieldset',
      component: 'FieldMetadata',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',   'hide',    'custom',  
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',   'hide',    'custom',  
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    table: {
      type: 'hash[]',
      method: 'table',
      label: 'Table Fieldset',
      component: 'FieldTable',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'textlist',
          attribute: 'columns',
          attributes: {
            label: 'Add Column'
          }
        }
      ],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',   'table',
          'pretty', 'hide', 
          'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',   'table',
          'pretty', 'hide', 
          'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    },
    taglist: {
      type: 'string[]',
      method: 'taglist',
      label: 'Taglist Field',
      component: 'FieldTaglist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    textlist: {
      type: 'string[]',
      method: 'textlist',
      label: 'Textlist Fieldset',
      component: 'FieldTextlist',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',    'space',    'comma', 
          'line',    'ol',       'ul', 
          'taglist', 'metadata', 'carousel', 
          'pretty',  'hide',     'custom', 
          'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: true
    },
    fieldset: {
      type: 'object',
      method: 'fieldset',
      label: 'Cutsom Fieldset',
      component: 'FieldFieldset',
      attributes: {
        show: true,
        fixed: {},
        default: {}
      },
      params: [
        {
          field: 'text',
          attribute: 'fieldset',
          attributes: {
            type: 'text',
            placeholder: 'Name of fieldset eg. address'
          }
        },
        {
          field: 'select',
          attribute: 'multiple',
          attributes: {
            placeholder: 'Multiple fieldsets?',
            options: [
              { label: 'Yes', value: 1 },
              { label: 'No', value: 0 }
            ]
          }
        }
      ],
      searchable: { show: false, default: false },
      filterable: { show: false, default: false },
      sortable: { show: false, default: false },
      validation: { 
        show: true, 
        filter: [
          'required', 'unique',
          'notempty', 'regexp'
        ] 
      },
      list: { 
        show: true, 
        filter: [
          'none',   'table',
          'pretty', 'hide', 
          'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none',   'table',
          'pretty', 'hide', 
          'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: true, default: undefined },
      enabled: false
    }
  },
  '---------------': {
    active: {
      type: 'boolean',
      method: 'active',
      label: 'Active',
      content: {
        name: 'active',
        label: 'Active'
      },
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: true },
      sortable: { show: false, default: true },
      validation: { 
        show: false, 
        filter: false
      },
      list: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: 'hide'
      },
      view: { 
        show: true, 
        filter: [
          'none', 'yesno',  'number',
          'hide', 'custom', 'formula'
        ],
        default: 'hide'
      },
      default: { show: false, default: 1 },
      enabled: true
    },
    created: {
      type: 'datetime',
      method: 'created',
      label: 'Created',
      content: {
        name: 'created',
        label: 'Created'
      },
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: true },
      sortable: { show: false, default: true },
      validation: { 
        show: false, 
        filter: false 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',     'number',   
          'date', 'relative', 'rel',
          'hide', 'custom',   'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',     'number',   
          'date', 'relative', 'rel',
          'hide', 'custom',   'formula'
        ],
        default: undefined
      },
      default: { show: false, default: 'now()' },
      enabled: true
    },
    updated: {
      type: 'datetime',
      method: 'updated',
      label: 'Updated',
      content: {
        name: 'updated',
        label: 'Updated'
      },
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: false, default: false },
      filterable: { show: false, default: true },
      sortable: { show: false, default: true },
      validation: { 
        show: false, 
        filter: false 
      },
      list: { 
        show: true, 
        filter: [
          'none', 'char',     'number',   
          'date', 'relative', 'rel',
          'hide', 'custom',   'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'char',     'number',   
          'date', 'relative', 'rel',
          'hide', 'custom',   'formula'
        ],
        default: undefined
      },
      default: { show: false, default: 'now()' },
      enabled: true
    },
    nanoid: {
      type: 'string',
      method: 'nanoid',
      label: 'UUID',
      component: false,
      attributes: {
        show: false,
        fixed: {},
        default: {}
      },
      params: [],
      searchable: { show: true, default: false },
      filterable: { show: true, default: false },
      sortable: { show: true, default: false },
      validation: { 
        show: false, 
        filter: false
      },
      list: { 
        show: true, 
        filter: [
          'none', 'lower', 'upper',  'capital',  
          'char', 'hide',  'custom', 'formula'
        ],
        default: undefined
      },
      view: { 
        show: true, 
        filter: [
          'none', 'lower', 'upper',  'capital',  
          'char', 'hide',  'custom', 'formula'
        ],
        default: undefined
      },
      default: { show: false, default: undefined },
      enabled: true
    }
  }
};

export function filterFormats(filter?: string[]|false) {
  if (!filter) return formats;
  const filtered: Record<string, Record<string, FormatOption>> = {};
  for (const group in formats) {
    for (const option in formats[group]) {
      if (filter.includes(option)) {
        if (!filtered[group]) filtered[group] = {};
        filtered[group][option] = formats[group][option];
      }
    }
  }
  return filtered;
}

export function filterValidators(filter?: string[]|false) {
  if (!filter) return validators;
  const filtered: Record<string, Record<string, ValidationOption>> = {};
  for (const group in validators) {
    for (const option in validators[group]) {
      if (filter.includes(option)) {
        if (!filtered[group]) filtered[group] = {};
        filtered[group][option] = validators[group][option];
      }
    }
  }
  return filtered;
}

export function getField(method: string) {
  for (const group in fields) {
    for (const option in fields[group]) {
      if (option === method) {
        return fields[group][option];
      }
    }
  } 
}

export function getColumnDefaults(
  field: string, 
  column: Partial<SchemaColumn> = {}
): Partial<SchemaColumn>|undefined {
  const selected = getField(field);
  if (!selected) return;
  const list = getFormat(selected.list.default || 'none');
  const view = getFormat(selected.view.default || 'none');
  return {
    ...column,
    name: selected?.content?.name || column.name,
    label: selected?.content?.label || column.label,
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
    searchable: selected.searchable.default,
    filterable: selected.filterable.default,
    sortable: selected.sortable.default
  }
}

export function getFields() {
  const flat: Record<string, FieldOption> = {};
  Object.keys(fields).map(group => {
    Object.keys(fields[group]).forEach(option => {
      flat[option] = fields[group][option];
    });
  });

  return flat;
}

export function getFormat(method: string) {
  for (const group in formats) {
    for (const option in formats[group]) {
      if (option === method) {
        return formats[group][option];
      }
    }
  } 
}

export function getFormats() {
  const flat: Record<string, FormatOption> = {};
  Object.keys(formats).map(group => {
    Object.keys(formats[group]).forEach(option => {
      flat[option] = formats[group][option];
    });
  });

  return flat;
}

export function getValidator(method: string) {
  for (const group in validators) {
    for (const option in validators[group]) {
      if (option === method) {
        return validators[group][option];
      }
    }
  } 
}

export function getValidators() {
  const flat: Record<string, ValidationOption> = {};
  Object.keys(validators).map(group => {
    Object.keys(validators[group]).forEach(option => {
      flat[option] = validators[group][option];
    });
  });

  return flat;
}

//types: string, text, string|number, string[], number, integer, 
//       float, boolean, date, datetime, time, object, hash, hash[]
// number = integer|float
// hash = {string:string}
// hash[] = {string:string}[]
export function inferColumnData(column: Partial<SchemaColumn>) {
  if (!column.field || !column.validation) return;
  const field = getField(column.field?.method || '');
  if (!field) return;

  const conditions = {
    req: !!column.validation.filter(validator => validator.method === 'required').length,
    uni: !!column.validation.filter(validator => validator.method === 'unique').length,
    lt: column.validation.filter(validator => validator.method === 'lt')[0]?.parameters[0],
    le: column.validation.filter(validator => validator.method === 'le')[0]?.parameters[0],
    gt: column.validation.filter(validator => validator.method === 'gt')[0]?.parameters[0],
    ge: column.validation.filter(validator => validator.method === 'ge')[0]?.parameters[0],
    ceq: column.validation.filter(validator => validator.method === 'ceq')[0]?.parameters[0],
    clt: column.validation.filter(validator => validator.method === 'clt')[0]?.parameters[0],
    cle: column.validation.filter(validator => validator.method === 'cle')[0]?.parameters[0],
    cgt: column.validation.filter(validator => validator.method === 'cgt')[0]?.parameters[0],
    cge: column.validation.filter(validator => validator.method === 'cge')[0]?.parameters[0],
    min: column.field.attributes.min,
    max: column.field.attributes.max,
    step: column.field.attributes.step
  };
  
  const unsigned = typeof conditions.min === 'number'
    ? conditions.min >= 0
    : typeof conditions.max === 'number'
    ? conditions.max >= 0
    : typeof conditions.lt === 'number'
    ? conditions.lt >= 0
    : typeof conditions.le === 'number'
    ? conditions.le >= 0
    : typeof conditions.gt === 'number'
    ? conditions.gt >= 0
    : typeof conditions.ge === 'number'
    ? conditions.ge >= 0
    : false;

  const lengths: Record<string, [string, string]|undefined> = {
    min: typeof conditions.min === 'number' 
      ? String(conditions.min).split('.', 2) as [string, string]
      : undefined,
    max: typeof conditions.max === 'number' 
      ? String(conditions.max).split('.', 2) as [string, string]
      : undefined,
    step: typeof conditions.step === 'number' 
      ? String(conditions.step).split('.', 2) as [string, string]
      : undefined,
    lt: typeof conditions.lt === 'number' 
      ? String(conditions.lt).split('.', 2) as [string, string]
      : undefined,
    le: typeof conditions.le === 'number' 
      ? String(conditions.le).split('.', 2) as [string, string]
      : undefined,
    gt: typeof conditions.gt === 'number' 
      ? String(conditions.gt).split('.', 2) as [string, string]
      : undefined,
    ge: typeof conditions.ge === 'number' 
      ? String(conditions.ge).split('.', 2) as [string, string]
      : undefined,
    ceq: typeof conditions.ceq === 'number' 
      ? String(conditions.ceq).split('.', 2) as [string, string]
      : undefined,
    clt: typeof conditions.clt === 'number' 
      ? String(conditions.clt).split('.', 2) as [string, string]
      : undefined,
    cle: typeof conditions.cle === 'number' 
      ? String(conditions.cle).split('.', 2) as [string, string]
      : undefined,
    cgt: typeof conditions.cgt === 'number' 
      ? String(conditions.cgt).split('.', 2) as [string, string]
      : undefined,
    cge: typeof conditions.cge === 'number' 
      ? String(conditions.cge).split('.', 2) as [string, string]
      : undefined
  }

  let variable = !conditions.ceq;
  let intLen = 0;
  let decLen = 0;
  for (const key in lengths) {
    if (Array.isArray(lengths[key])) {
      const [ int, dec ] = lengths[key] as [string, string];
      intLen = Math.max(int.length, intLen);
      decLen = Math.max(dec.length, decLen);
    }
  }

  const length = decLen > 0 
    ? [ intLen + decLen, decLen ] 
    : intLen;

  let inferred = 'varchar';
  if (column.field.attributes.type === 'number') {
    inferred = (lengths.step && lengths.step[1])
      || (lengths.min && lengths.min[1])
      || (lengths.max && lengths.max[1])
      ? 'float'
      : 'int';
  } else if (Array.isArray(column.field.attributes.options)) {
    if (column.field.attributes.options.filter(
      option => typeof option.value === 'number' 
        && String(option.value).indexOf('.') >= 0
    )) {
      inferred = 'float';
    } else if (column.field.attributes.options.filter(
      option => typeof option.value === 'number' 
    )) {
      inferred = 'int';
    }
  }

  const data: Partial<SchemaColumnData> = {
    required: conditions.req,
    unique: conditions.uni,
    unsigned
  };

  switch (field.type) {
    case 'string':
      data.type = variable ? 'varchar': 'char';
      data.length = intLen > 0 ? intLen : 255;
      break;
    case 'string|number':
      data.type = inferred;
      if (data.type === 'varchar') {
        data.length = intLen > 0 ? intLen : 255;
      } else {
        data.length = intLen > 0 ? intLen : 10;
      }
      break;
    case 'number':
      data.type = inferred !== 'string' ? inferred : 'float';
      data.length = length ? length : 10;
      break;
    case 'integer':
      data.type = 'int';
      if (intLen > 0) {
        data.length = intLen;
      }
      break;
    case 'float':
      data.type = 'float';
      data.length = length ? length : [ 10, 2 ];
      break;
    case 'text':
    case 'boolean':
    case 'date':
    case 'datetime':
    case 'time':
      data.type = field.type;
      break;
    case 'string[]':
    case 'hash':
    case 'hash[]':
    case 'object':
      data.type = 'json';
      break;
  }

  return data;
}
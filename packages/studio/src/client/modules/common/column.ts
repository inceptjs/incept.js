import type { SchemaColumn, FieldMethod, FormatMethod } from 'inceptjs';

export type FieldOption = { 
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
          'option',   'ne',     'cgt', 
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
          'option',   'ne',     'cgt', 
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'option',   'ne',     'cgt', 
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
          'option',   'ne',      'cgt',     
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
      enabled: false
    },
    text: {
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',    'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',     'cge',      'clt',
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
          'ne',       'cgt',    'cge',      'clt',
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
          'ne',       'cgt',    'cge',      'clt',
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
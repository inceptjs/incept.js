import type { 
  LegacyRef, 
  ReactNode, 
  ReactElement, 
  ChangeEvent, 
  KeyboardEvent 
} from 'react';

// General types
export type ExtendsType<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type AnyReactChildren = ReactNode|ReactElement|JSX.Element
  |ReactNode[]|ReactElement[]|JSX.Element[]|string;

// HTML types
export type HTMLImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>, 
  HTMLImageElement
>;

export type HTMLInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>, 
  HTMLInputElement
>;

export type HTMLTextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>, 
  HTMLTextAreaElement
>;

export type HTMLButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>, 
  HTMLButtonElement
>;

// Alert component
export type AlertProps = {
  color?: string,
  error?: boolean, 
  warning?: boolean, 
  info?: boolean, 
  success?: boolean, 
  muted?: boolean, 
  solid?: boolean, 
  outline?: boolean,
  curved?: boolean,
  rounded?: boolean, 
  pill?: boolean,
  style?: React.CSSProperties,
  className?: string,
  children?: React.ReactNode
};

// Badge component
export type BadgeProps = {
  color?: string,
  error?: boolean,  
  warning?: boolean,
  info?: boolean, 
  success?: boolean, 
  muted?: boolean, 
  solid?: boolean, 
  outline?: boolean,
  curved?: boolean,
  rounded?: boolean,
  pill?: boolean,
  style?: React.CSSProperties,
  className?: string,
  children?: React.ReactNode
};

// Button component
export type ButtonProps = HTMLButtonProps & {
  block?: boolean,
  color?: string,
  xs?: boolean, 
  sm?: boolean, 
  md?: boolean, 
  lg?: boolean, 
  xl?: boolean, 
  curved?: boolean,
  rounded?: boolean,
  pill?: boolean,
  danger?: boolean, 
  warning?: boolean, 
  success?: boolean,
  info?: boolean,
  muted?: boolean, 
  outline?: boolean, 
  transparent?: boolean, 
  solid?: boolean, 
  style?: React.CSSProperties|false
};

// Control component
export type ControlProps = {
  label?: string,
  error?: string,
  errorColor?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  children?: React.ReactNode
};

// Field Autocomplete component
export type FieldAutocompleteDropdownProps = { 
  options: string[]
  show: boolean,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  select: (value: string) => void,
  match: (option: string) => void
};
export type FieldAutocompleteConfig = {
  defaultValue?: string|number|readonly string[],
  onQuery?: (query: string) => void,
  onDropdown?: (show: boolean) => void,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  onUpdate?: (value: string) => void
};
export type FieldAutocompleteProps = FieldInputProps & {
  options: string[],
  error?: boolean,
  errorColor?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onQuery?: (query: string) => void,
  onDropdown?: (show: boolean) => void
};

// Field checkbox component
export type FieldCheckboxProps = HTMLInputProps & {
  label?: string,
  error?: any,
  color?: string,
  check?: boolean,
  circle?: boolean,
  square?: boolean,
  sharp?: boolean,
  rounded?: boolean,
  outline?: boolean,
  solid?: boolean,
  errorColor?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onUpdate?: (value: string|number|undefined, checked: boolean) => void
};

// Field country component
export type CountryData = {
  countryCode: string,
  countryName: string,
  currencyType: string,
  currencyCode: string,
  currencyName: string,
  currencyPlural: string,
  currencySymbol: string,
  language: string
};
export type FieldCountryOption = FieldSelectOption<CountryData>;
export type FieldCountryConfig = {
  value: string | FieldCountryOption | undefined,
  map: (country: CountryData) => FieldCountryOption
};
export type FieldCountryProps = ExtendsType<FieldSelectProps, {
  options?: undefined,
  value?: FieldCountryOption|string
}>;

// Field currency component
export type FieldCurrencyOption = FieldSelectOption<CountryData>;
export type FieldCurrencyConfig = FieldCountryConfig;
export type FieldCurrencyProps = ExtendsType<FieldSelectProps, {
  options?: undefined,
  value?: FieldCurrencyOption|string
}>;

// Field date component
export type FieldDateInput = string|number|Date;
export type FieldDateConfig = {
  defaultValue?: FieldDateInput, 
  onUpdate?: (value: string) => void
};
export type FieldDateProps = ExtendsType<FieldInputProps, {
  defaultValue?: FieldDateInput
}>;

// Field datetime component
export type FieldDatetimeInput = string|number|Date;
export type FieldDatetimeConfig = {
  defaultValue?: FieldDatetimeInput, 
  onUpdate?: (value: string) => void
};
export type FieldDatetimeProps = ExtendsType<FieldInputProps, {
  defaultValue?: FieldDatetimeInput
}>;

// Field input component
export type FieldInputConfig = {
  checked?: boolean,
  defaultChecked?: boolean,
  onChange?: Function, 
  onUpdate?: Function
};
export type FieldInputProps = ExtendsType<HTMLInputProps, {
  style?: React.CSSProperties|false,
  label?: string,
  error?: any,
  errorColor?: string,
  onUpdate?: (value: string) => void,
  passRef?: LegacyRef<HTMLInputElement>
}>;

// Field mask component
export type FieldMaskProps = FieldInputProps & { 
  mask?: string,
  regex?: string,
  alias?: string,
  repeat?: number,
  greedy?: boolean,
  numericInput?: boolean,
  rightAlign?: boolean,
  definitions?: Record<string, any>
  onReady?: Function
};

// Field metadata component
export type FieldMetadataType = { name: string, value: string|number|Date };
export type FieldMetadataConfig = {
  type?: string,
  values?: (FieldMetadataType|undefined)[],
  index: number,
  set: (values: (FieldMetadataType|undefined)[]) => void
};

// Field number component
export type FieldNumberOptions = {
  min?: number,
  max?: number,
  separator?: string,
  decimal?: string,
  decimals?: number,
  absolute?: boolean
};
export type FieldNumberProps = FieldInputProps & {
  separator?: string,
  decimal?: string,
  absolute?: boolean,
  width?: string,
  controls?: Function,
  onUpdate?: Function
};

// Field password component
export type FieldPasswordProps = FieldInputProps & {
  error?: boolean,
  errorColor?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false
};

// Field radio component
export type FieldRadioProps = HTMLInputProps & {
  label?: string,
  error?: any,
  color?: string,
  check?: boolean,
  circle?: boolean,
  square?: boolean,
  sharp?: boolean,
  rounded?: boolean,
  outline?: boolean,
  solid?: boolean,
  errorColor?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onUpdate?: (value: string|number|undefined, checked: boolean) => void
};

// Field select component
export type FieldSelectOption<T = any> = {
  label: ReactNode,
  value?: T,
  keyword?: string|Function
};
export type FieldSelectConfig = {
  value?: FieldSelectOption,
  onDropdown?: (show: boolean) => void,
  onSelected?: (value: FieldSelectOption) => void,
  onUpdate?: (value: string|number) => void
};
export type FieldSelectDropdownProps = { 
  options: FieldSelectOption[]
  show: boolean,
  error?: boolean,
  searchable?: boolean,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  select: (value: FieldSelectOption) => void,
  search: (e: KeyboardEvent) => void,
  match: (option: FieldSelectOption) => void
};
export type FieldSelectProps = {
  value?: FieldSelectOption,
  options: FieldSelectOption[],
  searchable?: boolean,
  placeholder?: string,
  error?: boolean,
  errorColor?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onDropdown?: (show: boolean) => void,
  onSelected?: (value: FieldSelectOption) => void,
  onUpdate?: (value: string|number) => void
};

// Fieldset component
export type FieldsetConfig<ValueType = any> = {
  value?: ValueType[],
  emptyValue?: ValueType,
  onChange?: (values: ValueType[]) => void,
  onUpdate?: (values: ValueType[]) => void
}
//use this type in your custom fieldset wrapper
//ex. const Custom: React.FC<FieldsetProps<YOUR ROW TYPE>> = (props) => {}
export type FieldsetProps<ValueType = any> = ExtendsType<ButtonProps, {
  label?: string,
  type?: string,
  value?: ValueType[],
  min?: number|string,
  max?: number|string,
  step?: number|string,
  emptyValue?: ValueType,
  error?: boolean,
  errorColor?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onChange?: (values: ValueType[]) => void,
  onUpdate?: (values: ValueType[]) => void
}>;
//use this type in your custom fields component
//ex. const Fields: React.FC<FieldsProps<YOUR ROW TYPE>> = (props) => {}
export type FieldsProps<ValueType = any> = {
  type?: string,
  min?: number|string,
  max?: number|string,
  step?: number|string,
  values?: (ValueType|undefined)[],
  index: number,
  error?: boolean,
  errorColor: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  set: (values: (ValueType|undefined)[]) => void
};

// Field switch component
export type FieldSwitchProps = HTMLInputProps & {
  label?: string,
  error?: any,
  rounded?: boolean,
  onoff?: boolean,
  yesno?: boolean,
  checkex?: boolean,
  sunmoon?: boolean,
  knob?: 'none'|'ridge'|'checkex',
  blue?: boolean,
  orange?: boolean,
  green?: boolean,
  theme?: string|number,
  errorColor?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  onUpdate?: (value: string|number|undefined, checked: boolean) => void
};

// Field textarea component
export type FieldTextareaConfig = {
  onChange?: Function, 
  onUpdate?: Function
};
export type FieldTextareaProps = ExtendsType<HTMLTextareaProps, {
  style?: React.CSSProperties|false,
  label?: string,
  error?: any,
  errorColor?: string,
  onUpdate?: (value: string) => void,
  passRef?: LegacyRef<HTMLTextAreaElement>
}>;

// Field textlist component
export type FieldTextlistType = string;
export type FieldTextlistConfig = {
  type?: string,
  values?: (FieldTextlistType|undefined)[],
  index: number,
  set: (values: (FieldTextlistType|undefined)[]) => void
};

// Field time component
export type FieldTimeInput = string|number|Date;
export type FieldTimeConfig = {
  defaultValue?: FieldTimeInput, 
  onUpdate?: (value: string) => void
};
export type FieldTimeProps = ExtendsType<FieldInputProps, {
  defaultValue?: FieldTimeInput
}>;

// Format capitalize component
export type FormatCapitalizeProps = { value: string };
// Format char count component
export type FormatCharCountProps = { value: string, count: number };
// Format color component
export type FormatColorProps = { value: string };
// Format comma separated component
export type FormatCommaSeparatedProps = { value: (string|number)[] };
// Format country component
export type FormatCountryProps = { value: string };
// Format currency component
export type FormatCurrencyProps = { value: string };
// Format date component
export type FormatDateProps = { value: string|number|Date, format?: string };
// Format email component
export type FormatEmailProps = { value: string };
// Format formula component
export type FormatFormulaProps = { value: string, data: Record<string, any> };
// Format html component
export type FormatHTMLProps = { value: string };
// Format image component
export type FormatImageProps = HTMLImageProps & { value: string };
// Format json component
export type FormatJSONProps = { value: any };
// Format line separated component
export type FormatLineSeparatedProps = { value: (string|number)[] };
// Format link component
export type FormatLinkProps = { value: string, label: string  };
// Format lower case component
export type FormatLowercaseProps = { value: string };
// Format markdown component
export type FormatMarkdownProps = { value: string };
// Format metadata component
export type FormatMetadataProps = { value: Record<string, string|number> };
// Format number component
export type FormatNumberProps = { value: string|number };
// Format ordered list component
export type FormatOrderedListProps = { value: (string|number)[] };
// Format phone component
export type FormatPhoneProps = { value: string };
// Format price component
export type FormatPriceProps = { value: string|number };
// Format rating component
export type FormatRatingProps = { value: string|number };
// Format relative component
export type FormatRelativeProps = { value: string|number|Date };
// Format space separated component
export type FormatSpaceSeparatedProps = { value: (string|number)[] };
// Format table component
export type FormatTableProps = { value: Record<string, string|number>[] };
// Format tag list component
export type FormatTagListProps = { value: (string|number)[] };
// Format unordered list component
export type FormatUnorderedListProps = { value: (string|number)[] };
// Format upper case component
export type FormatUppercaseProps = { value: string };
// Format word cound component
export type FormatWordCountProps = { value: string, count: number };
// Format yes no component
export type FormatYesnoProps = { value: any };

// Loading component
export type LoaderProps = {
  color?: string,
  show?: boolean,
  label?: string,
  style?: React.CSSProperties,
  className?: string,
};

// Modal component
export type ModalProps = {
  opened: boolean,
  onClose: Function,
  title?: string,
  style?: React.CSSProperties,
  className?: string,
  styles?: Record<string, React.CSSProperties|false|undefined>|false,
  classNames?: Record<string, string|false|undefined>|false,
  children?: React.ReactNode
};

// Table component
export type TableRuleProps = { width: string };

export type TableColProps = {
  style?: React.CSSProperties,
  className?: string,
  children?: AnyReactChildren,
  stickyBottom?: boolean,
  stickyLeft?: boolean,
  stickyRight?: boolean,
  stickyTop?: boolean,
  noWrap?: boolean,
  rowSpan?: number,
  colSpan?: number,
  wrap1?: boolean,
  wrap2?: boolean,
  wrap3?: boolean,
  wrap4?: boolean,
  wrap5?: boolean
};

export type TableFootProps = {
  style?: React.CSSProperties,
  className?: string,
  children?: AnyReactChildren,
  stickyBottom?: boolean,
  stickyLeft?: boolean,
  stickyRight?: boolean,
  noWrap?: boolean,
  rowSpan?: number,
  colSpan?: number,
};

export type TableHeadProps = {
  style?: React.CSSProperties,
  className?: string,
  children?: AnyReactChildren,
  stickyLeft?: boolean,
  stickyRight?: boolean,
  stickyTop?: boolean,
  noWrap?: boolean,
  rowSpan?: number,
  colSpan?: number,
};

export type TableRowProps = {
  style?: React.CSSProperties,
  className?: string,
  children?: AnyReactChildren,
  noWrap?: boolean,
  rowSpan?: number,
  colSpan?: number,
};

export type TableProps = {
  children?: ReactNode|ReactNode[]
};
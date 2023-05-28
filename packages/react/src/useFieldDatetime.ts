import type { FieldDatetimeConfig } from './types';

import useDate from './useFieldDate';
import useTime from './useFieldTime';

export default function useFieldDatetime({ defaultValue, onUpdate }: FieldDatetimeConfig) {
  const update = useDate({ onUpdate });
  const value = useTime({ defaultValue });
  return { value, update };
};
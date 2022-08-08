import React, { ReactElement, ReactNode, useEffect } from "react";
import styles from './styles.module.css';

interface SelectInputProps<K, V, E> {
  value?: string | number;
  options?: ({
    key: K,
    value: V,
    elem: E,
  })[];
  width?: number;
  height?: number;
  className?: string;
  onChange?: (key?: K, value?: V, elem?: E) => any,
}

export function SelectInput<K extends string | number, V, E extends (ReactNode | string)>({value, options, width, height, className, onChange}: SelectInputProps<K, V, E>) {
  useEffect(() => {
    if (value == undefined && options?.length) onChange?.(options[0].key, options[0].value, options[0].elem);
  }, []);
  return <select
    value={value}
    style={{width, height}}
    className={styles.base + (className ? (' ' + className) : '')}
    onChange={(e) => {
      const option = options?.find(x => x.key == e.target.value);
      onChange?.(option?.key, option?.value, option?.elem)
    }}
  >
    {options?.map((option, i) => <option key={i} value={option.key}>{option.elem}</option>)}
  </select>;
}

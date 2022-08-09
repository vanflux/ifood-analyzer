import React, { ReactElement, ReactNode, useEffect } from "react";
import styles from './styles.module.css';

interface SelectInputProps<V, E> {
  value?: V,
  options?: ({
    value: V,
    elem: E,
  })[];
  width?: number;
  height?: number;
  className?: string;
  onChange?: (value?: V, elem?: E) => any,
}

export function SelectInput<V, E extends (ReactNode | string)>({value, options, width, height, className, onChange}: SelectInputProps<V, E>) {
  useEffect(() => {
    if (value == undefined && options?.length) onChange?.(options[0].value, options[0].elem);
  }, []);
  const selectedIndex = options?.findIndex(option => option.value == value);
  return <select
    value={selectedIndex}
    style={{width, height}}
    className={styles.base + (className ? (' ' + className) : '')}
    onChange={(e) => {
      const option = options?.[Number(e.target.value)];
      onChange?.(option?.value, option?.elem)
    }}
  >
    {options?.map((option, i) => <option key={i} value={i}>{option.elem}</option>)}
  </select>;
}

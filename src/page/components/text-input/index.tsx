import React from "react";
import styles from './styles.module.css';

interface TextInputProps {
  value?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  roundedBorders?: boolean;
  className?: string;
  onChange?: (text: string) => any,
}

export function TextInput({value, placeholder, width, height, roundedBorders = true, className, onChange}: TextInputProps) {
  return <input
    value={value}
    placeholder={placeholder}
    style={{width, height, borderRadius: roundedBorders ? 6 : 0}}
    className={styles.base + (className ? (' ' + className) : '')}
    onChange={(e) => onChange?.(e.target.value)}
  ></input>;
}

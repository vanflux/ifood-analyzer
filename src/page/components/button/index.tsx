import React from "react";
import styles from './styles.module.css';

interface ButtonProps {
  type?: 'primary' | 'secondary';
  children?: any;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
}

export function Button({type = 'primary', children, className, onClick}: ButtonProps) {
  return <button
    className={styles.base + (className ? (' ' + className) : '') + (' ' + (type === 'primary' ? styles.primary : styles.secondary))}
    onClick={onClick}
  >
    {children}
  </button>;
}

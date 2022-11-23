import { MouseEventHandler } from "react";
import styles from "./Button.module.css";

export default function Button({
  onClick,
  className,
  children,
}: {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children?: any;
}) {
  return (
    <button onClick={onClick} className={className + " " + styles.button}>
      {children}
    </button>
  );
}

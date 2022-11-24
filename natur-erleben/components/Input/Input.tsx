import { Dispatch, SetStateAction } from "react";
import RenderIf from "../RenderIf";
import styles from "./Input.module.css";

export default function Input({
  className,
  placeholder,
  setState,
  error,
}: {
  className?: any;
  placeholder?: any;
  setState: Dispatch<SetStateAction<string>>;
  error?: string;
}) {
  return (
    <>
      <input
        className={className + " " + styles.input}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
      ></input>
      <RenderIf condition={error !== undefined && error !== ""}>
        <p className={styles.error}>{error}</p>
      </RenderIf>
    </>
  );
}

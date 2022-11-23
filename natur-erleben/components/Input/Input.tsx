import styles from "./Input.module.css";

export default function Input({
  className,
  placeholder,
}: {
  className?: any;
  placeholder?: any;
}) {
  return (
    <input
      className={className + " " + styles.input}
      placeholder={placeholder}
    ></input>
  );
}

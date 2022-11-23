import styles from "./Button.module.css"

export default function Button({ className }: { className?: string }) {
    return <button className={className + " " + styles.button}>Buba</button>
}
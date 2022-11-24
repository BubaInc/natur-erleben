import styles from "./PlayerCard.module.css";

export default function PlayerCard({ playerName }: { playerName: string }) {
  return <p className={styles.card}>{playerName}</p>;
}

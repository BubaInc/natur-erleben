import { Player } from "../../util/Firebase";
import styles from "./PlayerCardInGame.module.css";

export default function PlayerCardInGame({ player }: { player: Player }) {
  return (
    <p className={styles.card}>
      {player.name} | {player.numberCorrect}
    </p>
  );
}

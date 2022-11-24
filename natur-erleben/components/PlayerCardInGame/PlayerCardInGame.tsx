import { remove } from "firebase/database";
import {
  findPlayerId,
  GameData,
  path,
  Player,
  reference,
} from "../../util/Firebase";
import Button from "../Button";
import RenderIf from "../RenderIf";
import styles from "./PlayerCardInGame.module.css";

export default function PlayerCardInGame({
  player,
  host,
  gameData,
}: {
  player: Player;
  host: boolean;
  gameData: GameData;
}) {
  return (
    <p className={styles.card}>
      {player.name} | {player.numberCorrect}
      <RenderIf condition={host}>
        <Button
          red
          className={styles.removePlayerButton}
          onClick={async () => {
            // Remove that player
            const playerId = findPlayerId(gameData, player.name);
            await remove(
              reference(path("games", gameData.gameId, "players", playerId))
            );
          }}
        >
          Entfernen
        </Button>
      </RenderIf>
    </p>
  );
}

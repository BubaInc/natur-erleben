import { useEffect, useState } from "react";
import { downloadGameData, GameData, Player } from "../util/Firebase";
import { getItem } from "../util/StorageHandler";
import styles from "../styles/Result.module.css";
import Slidey from "../components/Slidey";
import { useSlidey } from "../components/Slidey/Slidey";
import PlayerCardInGame from "../components/PlayerCardInGame";

export default function Result() {
  const [gameData, setGameData] = useState(new GameData("", "", -1, {}, "6"));
  useEffect(() => {
    const cachedGameId = getItem("gameId");
    if (!cachedGameId) return;
    downloadGameData(cachedGameId).then((data) => setGameData(data));
  }, []);

  const { open, changeSlidey } = useSlidey();

  return (
    <div className={styles.container}>
      <p className={styles.title}>Endergebnis</p>
      <Slidey open={open}>
        <div className={styles.playersContainer}>
          {Object.keys(gameData.players)
            .map((key) => gameData.players[key])
            .sort((a: Player, b: Player) => b.numberCorrect - a.numberCorrect)
            .map((player: Player, i: number) => (
              <PlayerCardInGame
                player={player}
                key={i}
                host={false}
                gameData={gameData}
              />
            ))}
        </div>
      </Slidey>
    </div>
  );
}

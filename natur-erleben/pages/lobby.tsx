import { onValue, set } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RenderIf from "../components/RenderIf";
import SpinnerButton from "../components/SpinnerButton";
import { downloadGameData, GameData, reference } from "../util/Firebase";
import { getItem } from "../util/StorageHandler";
import styles from "../styles/Lobby.module.css";
import Slidey from "../components/Slidey";
import { useSlidey } from "../components/Slidey/Slidey";
import PlayerCard from "../components/PlayerCard";

export default function Lobby() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([]);
  const [gameData, setGameData] = useState(new GameData("", "", -1, {}, "6"));
  const [myName, setMyName] = useState("");

  useEffect(() => {
    const cachedName = getItem("name");
    const cachedGameId = getItem("gameId");
    if (!cachedName || !cachedGameId) return;
    setMyName(cachedName);
    downloadGameData(cachedGameId).then((data) => {
      setGameData(data);
      // Check if the game has started or if the player list has updated
      onValue(reference("games/" + cachedGameId), (snapshot) => {
        const value = snapshot.val();
        setGameData(value);
        setPlayers(
          Object.keys(value.players).map((key) => value.players[key].name)
        );
        if (value.stage == 1) router.push("/stage");
      });
    });
  }, []);

  const { open, changeSlidey } = useSlidey();

  return (
    <div className={styles.container}>
      <p className={styles.title}>ID: {gameData.gameId}</p>
      <Slidey open={open}>
        <div className={styles.playersContainer}>
          {players.map((player, i) => {
            return <PlayerCard playerName={player} key={i} />;
          })}
        </div>
        <RenderIf condition={gameData.host == myName}>
          <SpinnerButton
            disabled={players.length <= 1}
            job={() => changeStage(gameData.gameId, 1)}
          >
            Spiel starten
          </SpinnerButton>
        </RenderIf>
      </Slidey>
    </div>
  );
}

const changeStage = async (gameId: string, newStage: number) => {
  const stageRef = reference("games/" + gameId + "/stage");
  await set(stageRef, newStage);
};

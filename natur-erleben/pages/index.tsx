import styles from "../styles/Home.module.css";
import { get, push, set } from "firebase/database";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import RenderIf from "../components/RenderIf";
import SpinnerButton from "../components/SpinnerButton";
import {
  downloadGameData,
  GameData,
  path,
  Player,
  reference,
  uploadGameData,
} from "../util/Firebase";
import { init } from "../util/StorageHandler";
import Button from "../components/Button";
import Input from "../components/Input";
import Slidey from "../components/Slidey";
import { useSlidey } from "../components/Slidey/Slidey";

const Home: NextPage = () => {
  const router = useRouter();
  // Stores the player name and whether or not it is invalid
  const [playerName, setPlayerName] = useState("");
  const [invalidPlayerName, setInvalidPlayerName] = useState("");
  // Stores the game id and whether or not it is invalid
  const [gameId, setGameId] = useState("");
  const [invalidGameId, setInvalidGameId] = useState("");
  // The state that identifies the current step in the create / join game process
  type Step = "start" | "create" | "join";
  const [step, setStep] = useState<Step>("start");

  const [sixthGrade, setSixthGrade] = useState(true);

  // Gets called whenever the user clicks the "continue" button
  const onCreateGameClick = async () => {
    if (step == "create") {
      // Create a new game
      const id = await generateNewGameId();
      await uploadGameData(
        id,
        new GameData(id, playerName, 0, {}, sixthGrade ? "6" : "8")
      );
      const newPlayer = push(reference("games/" + id + "/players"));
      await set(newPlayer, new Player(playerName, 0, false, "none"));
      init(playerName, id);
      router.push("/lobby");
    } else if (step == "join") {
      // Check if the entered values are valid
      if (!(await isGameIdValid(gameId))) {
        setInvalidGameId("Diese ID ist ungültig.");
        return;
      } else if (!(await isPlayerNameAvailable(playerName, gameId))) {
        setInvalidPlayerName("Dieser Spielername ist schon vergeben.");
        return;
      }
      // Join the game
      await set(
        push(reference("games/" + gameId + "/players")),
        new Player(playerName, 0, false, "none")
      );
      init(playerName, gameId);
      router.push("/lobby");
    }
  };

  const { open, changeSlidey } = useSlidey();

  return (
    <div className={styles.container}>
      <p className={styles.title}>Natur Erleben</p>
      <Slidey open={open}>
        <RenderIf condition={step === "start"}>
          <Button
            onClick={() => changeSlidey(() => setStep("create"))}
            className={styles.menuButton}
          >
            SPIEL ERÖFFNEN
          </Button>
          <Button
            onClick={() => changeSlidey(() => setStep("join"))}
            className={styles.menuButton}
          >
            SPIEL BEITRETEN
          </Button>
        </RenderIf>
        <RenderIf condition={step === "join"}>
          <Input
            setState={setGameId}
            placeholder="Spiel ID"
            error={invalidGameId}
          />
          <Input
            setState={setPlayerName}
            placeholder="Spielername"
            error={invalidPlayerName}
          />
          <SpinnerButton
            fullWidth
            job={onCreateGameClick}
            disabled={
              step == "create"
                ? playerName == ""
                : playerName == "" || gameId == ""
            }
          >
            Weiter
          </SpinnerButton>
        </RenderIf>
        <RenderIf condition={step === "create"}>
          <Input
            setState={setPlayerName}
            placeholder="Spielername"
            error={invalidPlayerName}
          />
          <div className={styles.gradeContainer}>
            <p className={styles.gradeText}>
              Du hast Klasse {sixthGrade ? "6" : "8"} ausgewählt
            </p>
            <Button small onClick={() => setSixthGrade(!sixthGrade)}>
              Klasse wechseln
            </Button>
          </div>
          <SpinnerButton
            fullWidth
            job={onCreateGameClick}
            disabled={
              step == "create"
                ? playerName == ""
                : playerName == "" || gameId == ""
            }
          >
            Weiter
          </SpinnerButton>
        </RenderIf>
      </Slidey>
    </div>
  );
};

export default Home;

const generateNewGameId = async () => {
  // Download all the game ids
  const gameIds = Object.keys((await get(reference("games"))).val());
  // Regenerate game id until it is not in the list
  let gameId = "";
  while (gameId == "") {
    const num1 = Math.floor(Math.random() * 10).toString();
    const num2 = Math.floor(Math.random() * 10).toString();
    const num3 = Math.floor(Math.random() * 10).toString();
    const num4 = Math.floor(Math.random() * 10).toString();
    const newGameId = num1 + num2 + num3 + num4;
    if (!gameIds.includes(newGameId)) {
      gameId = newGameId;
    }
  }
  return gameId;
};

const isGameIdValid = async (gameId: string) =>
  (await get(reference("games/" + gameId))).exists();

const isPlayerNameAvailable = async (playerName: string, gameId: string) => {
  if (playerName.includes("/")) return false;
  const data = await downloadGameData(gameId);
  return !Object.keys(data.players)
    .map((key) => data.players[key].name)
    .includes(playerName);
};

import { get, set } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import RenderIf from "../components/RenderIf";
import SpinnerButton from "../components/SpinnerButton";
import Timer from "../components/Timer";
import {
  downloadGameData,
  findPlayerId,
  GameData,
  path,
  Player,
  reference,
  useSync,
} from "../util/Firebase";
import { getItem, setItem } from "../util/StorageHandler";
import { Question, stages6, stages8 } from "../util/Stages";
import styles from "../styles/Stage.module.css";
import Slidey from "../components/Slidey";
import { useSlidey } from "../components/Slidey/Slidey";
import Button from "../components/Button";
import PlayerCardInGame from "../components/PlayerCardInGame";
import Image from "next/image";
import NextStep from "../components/NextStep";

export default function Stage() {
  const router = useRouter();

  // Values that get synchronized
  const gameData = useSync(new GameData("", "", 1, {}));
  const myPlayerData = useSync(new Player("", 0, false, "none"));
  const stage = useSync(0);
  const answerStatus = useSync<"none" | "correct" | "wrong" | "timeout">(
    "none"
  );
  const ready = useSync(false);

  // State for the timer
  const maxTime = 15;
  const [countdown, setCountdown] = useState(maxTime);

  // Retrieve correct values for the question and the answers
  const question = stages[stage.state - 1];
  const answers = question ? question.answers : [];

  const [hasSeenQuestion, setHasSeenQuestion] = useState(false);

  // Sets up data synchronization after page load
  useEffect(() => {
    // Retrieve cached values
    const cachedName = getItem("name");
    const cachedGameId = getItem("gameId");
    const cachedHasSeenQuestion = getItem("hasSeenQuestion");
    setHasSeenQuestion(cachedHasSeenQuestion == "true");
    if (!cachedName || !cachedGameId) return;

    // Setup all the synchronized values
    downloadGameData(cachedGameId).then((data) => {
      stage.setup(path("games", cachedGameId, "stage"), (newValue) => {
        if (newValue > stage.state) {
          setCountdown(maxTime);
          setItem("hasSeenQuestion", "true");
          setHasSeenQuestion(false);
        }
        if (newValue > stages.length) router.push("/result");
      });
      const playerId = findPlayerId(data, cachedName);
      myPlayerData.setup(path("games", cachedGameId, "players", playerId));
      gameData.setup(path("games", cachedGameId));
      answerStatus.setup(
        path("games", cachedGameId, "players", playerId, "answerStatus")
      );
      ready.setup(path("games", cachedGameId, "players", playerId, "ready"));
    });
  }, []);

  const { open, changeSlidey } = useSlidey();

  return question != null && myPlayerData != null ? (
    <div className={styles.container}>
      <p className={styles.title}>ID: {gameData.state.gameId}</p>
      <Slidey open={open}>
        {question.question === "NEXT_STEP" ? (
          <NextStep
            isHost={gameData.state.host == myPlayerData.state.name}
            question={question}
            nextStage={nextStage}
            isEveryoneReady={isEveryoneReady}
            makeEveryoneUnready={makeEveryoneUnready}
            gameData={gameData.state}
          />
        ) : (
          <>
            <p className={styles.question}>{question.question}</p>
            <RenderIf condition={answerStatus.state === "wrong"}>
              <p className={styles.wrongAnswer}>
                Falsch! Richtige Antwort:{" "}
                {question.type === "img" ? (
                  <Image
                    src={question.correct as string}
                    width="143"
                    height="100"
                  />
                ) : (
                  question.correct
                )}
              </p>
            </RenderIf>
            <RenderIf condition={answerStatus.state === "timeout"}>
              <p className={styles.wrongAnswer}>Die Zeit ist abgelaufen!</p>
            </RenderIf>
            <RenderIf condition={answerStatus.state === "correct"}>
              <p className={styles.correctAnswer}>Richtige Antwort!</p>
            </RenderIf>
            <Timer
              enabled={answerStatus.state == "none"}
              countdown={countdown}
              setCountdown={setCountdown}
              onTimeout={async () => {
                if (answerStatus.state != "timeout") {
                  await changeAnswerStatus(
                    gameData.state.gameId,
                    myPlayerData.state.name,
                    "timeout"
                  );
                  await changeReady(
                    gameData.state.gameId,
                    myPlayerData.state.name,
                    true
                  );
                }
              }}
            />
            <RenderIf condition={answerStatus.state == "none"}>
              {/* The list of answers */}
              <div className={styles.answers}>
                {answers.map((answer, i) => (
                  <Button
                    key={i}
                    disabled={hasSeenQuestion}
                    onClick={async () => {
                      await changeReady(
                        gameData.state.gameId,
                        myPlayerData.state.name,
                        true
                      );
                      await changeAnswerStatus(
                        gameData.state.gameId,
                        myPlayerData.state.name,
                        isAnswerCorrect(answer, question) ? "correct" : "wrong"
                      );
                      if (isAnswerCorrect(answer, question)) {
                        await increaseNumberCorrect(
                          gameData.state.gameId,
                          myPlayerData.state.name
                        );
                      }
                    }}
                  >
                    {question.type === "img" ? (
                      <Image src={answer} width="143" height="100" />
                    ) : (
                      <p>{answer}</p>
                    )}
                  </Button>
                ))}
              </div>
            </RenderIf>
            <RenderIf condition={answerStatus.state != "none"}>
              {/* Shows the leaderboard ordered by numberCorrect */}
              <div className={styles.playersContainer}>
                {Object.keys(gameData.state.players)
                  .map((key) => gameData.state.players[key])
                  .sort(
                    (a: Player, b: Player) => b.numberCorrect - a.numberCorrect
                  )
                  .map((player: Player, i: number) => (
                    <PlayerCardInGame
                      key={i}
                      gameData={gameData.state}
                      host={
                        gameData.state.host == myPlayerData.state.name &&
                        player.name !== myPlayerData.state.name
                      }
                      player={player}
                    ></PlayerCardInGame>
                  ))}
              </div>
              <RenderIf
                condition={
                  ready && gameData.state.host == myPlayerData.state.name
                }
              >
                <SpinnerButton
                  disabled={!isEveryoneReady(gameData.state)}
                  job={async () => {
                    await makeEveryoneUnready(gameData.state.gameId);
                    await nextStage(gameData.state.gameId);
                  }}
                >
                  Nächste Frage
                </SpinnerButton>
              </RenderIf>
            </RenderIf>
          </>
        )}
      </Slidey>
    </div>
  ) : (
    <></>
  );
}

const changeAnswerStatus = async (
  gameId: string,
  playerName: string,
  answerStatus: "none" | "correct" | "wrong" | "timeout"
) => {
  const gameData = await downloadGameData(gameId);
  const answerStatusRef = reference(
    path(
      "games",
      gameId,
      "players",
      findPlayerId(gameData, playerName),
      "answerStatus"
    )
  );
  await set(answerStatusRef, answerStatus);
};

const changeReady = async (
  gameId: string,
  playerName: string,
  ready: boolean
) => {
  const gameData = await downloadGameData(gameId);
  const readyRef = reference(
    path(
      "games",
      gameId,
      "players",
      findPlayerId(gameData, playerName),
      "ready"
    )
  );
  await set(readyRef, ready);
};

const increaseNumberCorrect = async (gameId: string, playerName: string) => {
  const numberCorrectRef = reference(
    path(
      "games",
      gameId,
      "players",
      findPlayerId(await downloadGameData(gameId), playerName),
      "numberCorrect"
    )
  );
  await set(numberCorrectRef, (await get(numberCorrectRef)).val() + 1);
};

const isEveryoneReady = (gameData: GameData) =>
  !Object.keys(gameData.players)
    .map((key) => gameData.players[key].ready)
    .includes(false);

const makeEveryoneUnready = async (gameId: string) => {
  const playersRef = reference("games/" + gameId + "/players");
  const data = (await get(playersRef)).val();
  Object.keys(data).forEach((key) => {
    data[key].ready = false;
    data[key].answerStatus = "none";
  });
  await set(playersRef, data);
};

const nextStage = async (gameId: string) => {
  const stageRef = reference(path("games", gameId, "stage"));
  await set(stageRef, (await get(stageRef)).val() + 1);
};

const isAnswerCorrect = (answer: string, question: Question) => {
  if (typeof question.correct == typeof "") {
    // correct answer is a string
    return answer == question.correct;
  } else {
    // correct answer allows multiple values
    return (question.correct as string[]).includes(answer);
  }
};

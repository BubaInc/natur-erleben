import Alert from "@mui/material/Alert"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { get, set } from "firebase/database"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import Timer from "../components/Timer"
import {
  downloadGameData,
  findPlayerId,
  GameData,
  Player,
  reference,
  useSync,
} from "../util/Firebase"
import { getItem } from "../util/StorageHandler"
import { stages } from "../util/Stages"

export default function Stage() {
  const router = useRouter()

  // Values that get synchronized
  const gameData = useSync(new GameData("", "", 1, {}))
  const myPlayerData = useSync(new Player("", 0, false, "none"))
  const answerStatus = useSync<"none" | "correct" | "wrong" | "timeout">("none")
  const ready = useSync(false)

  // State for the timer
  const maxTime = 10
  const [countdown, setCountdown] = useState(maxTime)

  // Retrieve correct values for the question and the answers
  const question = stages[gameData.state.stage - 1]
  const answers = question ? question.answers : []

  // Sets up data synchronization after page load
  useEffect(() => {
    // Retrieve cached values
    const cachedName = getItem("name")
    const cachedGameId = getItem("gameId")
    if (!cachedName || !cachedGameId) return

    // Setup all the synchronized values
    downloadGameData(cachedGameId).then((data) => {
      const playerId = findPlayerId(data, cachedName)
      myPlayerData.setup("games/" + cachedGameId + "/players/" + playerId)
      gameData.setup("games/" + cachedGameId, (newValue) => {
        if (newValue.stage > gameData.state.stage) setCountdown(maxTime)
        if (newValue.stage > stages.length - 1) router.push("/result")
      })
      answerStatus.setup(
        "games/" + cachedGameId + "/players/" + playerId + "/answerStatus"
      )
      ready.setup("games" + cachedGameId + "/players/" + playerId + "/ready")
    })
  }, [])

  return question != null && myPlayerData != null ? (
    <Container maxWidth="sm">
      {/* The title displaying the question */}
      <Typography variant="h2" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      {/* Display the answers if the user has not answered yet */}
      <RenderIf condition={answerStatus.state == "none"}>
        {/* Timer that readies the player up when time is up */}
        <Timer
          countdown={countdown}
          setCountdown={setCountdown}
          onTimeout={async () => {
            await changeAnswerStatus(
              gameData.state.gameId,
              myPlayerData.state.name,
              "timeout"
            )
            await changeReady(
              gameData.state.gameId,
              myPlayerData.state.name,
              true
            )
          }}
        />
        {/* The list of answers */}
        <List>
          {answers.map((answer, i) => (
            <ListItemButton
              key={i}
              color="secondary"
              disabled={myPlayerData.state.ready}
              onClick={async () => {
                await changeReady(
                  gameData.state.gameId,
                  myPlayerData.state.name,
                  true
                )
                if (answer == question.correct) {
                  await changeAnswerStatus(
                    gameData.state.gameId,
                    myPlayerData.state.name,
                    "correct"
                  )
                  await increaseNumberCorrect(
                    gameData.state.gameId,
                    myPlayerData.state.name
                  )
                } else {
                  await changeAnswerStatus(
                    gameData.state.gameId,
                    myPlayerData.state.name,
                    "wrong"
                  )
                }
              }}
            >
              <ListItemText>{answer}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </RenderIf>
      <RenderIf condition={answerStatus.state == "correct"}>
        <Alert severity="success">Richtige Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus.state == "wrong"}>
        <Alert severity="error">Falsche Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus.state == "timeout"}>
        <Alert severity="error">Die Zeit ist abgelaufen!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus.state != "none"}>
        {/* Shows the leaderboard ordered by numberCorrect */}
        <List>
          {Object.keys(gameData.state.players)
            .map((key) => gameData.state.players[key])
            .sort((a: Player, b: Player) => b.numberCorrect - a.numberCorrect)
            .map((player: Player, i: number) => (
              <ListItemText key={i}>
                {player.name + " " + player.numberCorrect}
              </ListItemText>
            ))}
        </List>
      </RenderIf>
      <RenderIf
        condition={ready && gameData.state.host == myPlayerData.state.name}
      >
        <SpinnerButton
          disabled={!isEveryoneReady(gameData.state)}
          job={async () => {
            await makeEveryoneUnready(gameData.state.gameId)
            await nextStage(gameData.state.gameId)
            setCountdown(maxTime)
          }}
        >
          Nächste Station
        </SpinnerButton>
      </RenderIf>
    </Container>
  ) : (
    <></>
  )
}

const changeAnswerStatus = async (
  gameId: string,
  playerName: string,
  answerStatus: "none" | "correct" | "wrong" | "timeout"
) => {
  const gameData = await downloadGameData(gameId)
  const answerStatusRef = reference(
    "games/" +
      gameId +
      "/players/" +
      findPlayerId(gameData, playerName) +
      "/answerStatus"
  )
  await set(answerStatusRef, answerStatus)
}

const changeReady = async (
  gameId: string,
  playerName: string,
  ready: boolean
) => {
  const gameData = await downloadGameData(gameId)
  const readyRef = reference(
    "games/" +
      gameId +
      "/players/" +
      findPlayerId(gameData, playerName) +
      "/ready"
  )
  await set(readyRef, ready)
}

const increaseNumberCorrect = async (gameId: string, playerName: string) => {
  const numberCorrectRef = reference(
    "games/" +
      gameId +
      "/players/" +
      findPlayerId(await downloadGameData(gameId), playerName) +
      "/numberCorrect"
  )
  await set(numberCorrectRef, (await get(numberCorrectRef)).val() + 1)
}

const isEveryoneReady = (gameData: GameData) =>
  !Object.keys(gameData.players)
    .map((key) => gameData.players[key].ready)
    .includes(false)

const makeEveryoneUnready = async (gameId: string) => {
  const playersRef = reference("games/" + gameId + "/players")
  const data = (await get(playersRef)).val()
  Object.keys(data).forEach((key) => {
    data[key].ready = true
    data[key].answerStatus = "none"
  })
  await set(playersRef, data)
}

const nextStage = async (gameId: string) => {
  const stageRef = reference("games/" + gameId + "/stage")
  await set(stageRef, (await get(stageRef)).val() + 1)
}

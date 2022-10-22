import Alert from "@mui/material/Alert"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { get, onValue, set } from "firebase/database"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import Timer from "../components/Timer"
import {
  downloadGameData,
  downloadPlayerData,
  findPlayerId,
  GameData,
  Player,
  reference,
} from "../util/Firebase"
import { getItem } from "../util/StorageHandler"
import { stages } from "../util/Stages"

export default function Stage() {
  const router = useRouter()

  // Values that get synchronized
  const [gameData, setGameData] = useState(new GameData("", "", 1, {}))
  const [myPlayerData, setMyPlayerData] = useState(
    new Player("", 0, false, "none")
  )
  const [answerStatus, setAnswerStatus] = useState<
    "none" | "correct" | "wrong" | "timeout"
  >("none")
  const [ready, setReady] = useState(false)

  // State for the timer
  const maxTime = 10
  const [countdown, setCountdown] = useState(maxTime)

  // Retrieve correct values for the question and the answers
  const question = stages[gameData.stage - 1]
  const answers = question ? question.answers : []

  // Sets up data synchronization after page load
  useEffect(() => {
    // Retrieve cached values
    const cachedName = getItem("name")
    const cachedGameId = getItem("gameId")
    if (!cachedName || !cachedGameId) return
    downloadPlayerData(cachedGameId, cachedName).then((data) => {
      setMyPlayerData(data)
      setAnswerStatus(data.answerStatus)
      setReady(data.ready)
      // Listen to changes to own player data
      onValue(
        reference(
          "games/" +
            cachedGameId +
            "/players/" +
            findPlayerId(gameData, cachedName)
        ),
        (snapshot) => {
          if (!snapshot.exists()) return
          const value = snapshot.val()
          setMyPlayerData(value)
          setAnswerStatus(value.answerStatus)
          setReady(value.ready)
        }
      )
    })
    downloadGameData(cachedGameId).then((data) => {
      setGameData(data)
      // Listen to changes to the game data
      onValue(reference("games/" + cachedGameId), (snapshot) => {
        if (!snapshot.exists()) return
        const value = snapshot.val()
        setGameData(value)
        if (value.stage > gameData.stage) setCountdown(maxTime)
        if (value.stage > stages.length - 1) router.push("/result")
      })
    })
  }, [])

  return question != null && myPlayerData != null ? (
    <Container maxWidth="sm">
      {/* The title displaying the question */}
      <Typography variant="h2" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      {/* Display the answers if the user has not answered yet */}
      <RenderIf condition={answerStatus == "none"}>
        {/* Timer that readies the player up when time is up */}
        <Timer
          countdown={countdown}
          setCountdown={setCountdown}
          onTimeout={async () => {
            await changeAnswerStatus(
              gameData.gameId,
              myPlayerData.name,
              "timeout"
            )
            await changeReady(gameData.gameId, myPlayerData.name, true)
          }}
        />
        {/* The list of answers */}
        <List>
          {answers.map((answer, i) => (
            <ListItemButton
              key={i}
              color="secondary"
              disabled={myPlayerData.ready}
              onClick={async () => {
                await changeReady(gameData.gameId, myPlayerData.name, true)
                if (answer == question.correct) {
                  await changeAnswerStatus(
                    gameData.gameId,
                    myPlayerData.name,
                    "correct"
                  )
                  await increaseNumberCorrect(
                    gameData.gameId,
                    myPlayerData.name
                  )
                } else {
                  await changeAnswerStatus(
                    gameData.gameId,
                    myPlayerData.name,
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
      <RenderIf condition={answerStatus == "correct"}>
        <Alert severity="success">Richtige Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus == "wrong"}>
        <Alert severity="error">Falsche Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus == "timeout"}>
        <Alert severity="error">Die Zeit ist abgelaufen!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus != "none"}>
        {/* Shows the leaderboard ordered by numberCorrect */}
        <List>
          {Object.keys(gameData.players)
            .map((key) => gameData.players[key])
            .sort((a: Player, b: Player) => b.numberCorrect - a.numberCorrect)
            .map((player: Player, i: number) => (
              <ListItemText key={i}>
                {player.name + " " + player.numberCorrect}
              </ListItemText>
            ))}
        </List>
      </RenderIf>
      <RenderIf condition={ready && gameData.host == myPlayerData.name}>
        <SpinnerButton
          disabled={!isEveryoneReady(gameData)}
          job={async () => {
            await makeEveryoneUnready(gameData.gameId)
            await nextStage(gameData.gameId)
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
  const gameData = await downloadGameData(gameId)
  const playerId = findPlayerId(gameData, playerName)
  const numberCorrectRef = reference(
    "games/" +
      gameId +
      "/players/" +
      findPlayerId(gameData, playerName) +
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

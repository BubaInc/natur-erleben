import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { get, push, set } from "firebase/database"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import {
  downloadGameData,
  GameData,
  Player,
  reference,
  uploadGameData,
} from "../util/Firebase"
import { getItem, init } from "../util/StorageHandler"

const Home: NextPage = () => {
  const router = useRouter()
  // Stores the player name and whether or not it is invalid
  const [playerName, setPlayerName] = useState("")
  const [invalidPlayerName, setInvalidPlayerName] = useState(false)
  // Stores the game id and whether or not it is invalid
  const [gameId, setGameId] = useState("")
  const [invalidGameId, setInvalidGameId] = useState(false)
  // The state that identifies the current step in the create / join game process
  type Step = "start" | "create" | "join"
  const [step, setStep] = useState<Step>("start")
  // Stores the cached game id
  const [reconnect, setReconnect] = useState("")

  // Check whether there is a cached game id
  useEffect(() => {
    const cachedId = getItem("gameId")
    if (cachedId != null) {
      setReconnect(cachedId)
    }
  }, [])

  // Gets called whenever the user clicks the "continue" button
  const onCreateGameClick = async () => {
    if (step == "create") {
      // Create a new game
      const id = await generateNewGameId()
      await uploadGameData(id, new GameData(id, playerName, 0, {}))
      const newPlayer = push(reference("games/" + id + "/players"))
      await set(newPlayer, new Player(playerName, 0, false, "none"))
      init(playerName, id)
      router.push("/lobby")
    } else if (step == "join") {
      // Check if the entered values are valid
      if (!(await isGameIdValid(gameId))) {
        setInvalidGameId(true)
        return
      } else if (!(await isPlayerNameAvailable(playerName, gameId))) {
        setInvalidPlayerName(true)
        return
      }
      // Join the game
      await set(
        push(reference("games/" + gameId + "/players")),
        new Player(playerName, 0, false, "none")
      )
      init(playerName, gameId)
      router.push("/lobby")
    }
  }

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h2">Natur Erleben</Typography>
          </Box>
        </Grid>
        <RenderIf condition={reconnect != ""}>
          <Grid item xs={12}>
            <Button onClick={() => router.push("/stage")}>
              Wieder mit Spiel {reconnect} verbinden
            </Button>
          </Grid>
        </RenderIf>
        <RenderIf condition={step === "start"}>
          <>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setStep("create")}
              >
                Spiel eröffnen
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => setStep("join")}
              >
                Spiel beitreten
              </Button>
            </Grid>
          </>
        </RenderIf>
        <RenderIf condition={step == "create" || step == "join"}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              fullWidth
              onChange={(e) => setPlayerName(e.target.value)}
              error={invalidPlayerName}
            ></TextField>
          </Grid>
          <RenderIf condition={step == "join"}>
            <Grid item xs={12}>
              <TextField
                label="Spiel ID"
                fullWidth
                onChange={(e) => setGameId(e.target.value)}
                error={invalidGameId}
              ></TextField>
            </Grid>
          </RenderIf>
        </RenderIf>
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Container>
  )
}

export default Home

const generateNewGameId = async () => {
  // Download all the game ids
  const gameIds = Object.keys((await get(reference("games"))).val())
  // Regenerate game id until it is not in the list
  let gameId = ""
  while (gameId == "") {
    const num1 = Math.floor(Math.random() * 10).toString()
    const num2 = Math.floor(Math.random() * 10).toString()
    const num3 = Math.floor(Math.random() * 10).toString()
    const num4 = Math.floor(Math.random() * 10).toString()
    const newGameId = num1 + num2 + num3 + num4
    if (!gameIds.includes(newGameId)) {
      gameId = newGameId
    }
  }
  return gameId
}

const isGameIdValid = async (gameId: string) =>
  (await get(reference("games/" + gameId))).exists()

const isPlayerNameAvailable = async (playerName: string, gameId: string) => {
  if (playerName.includes("/")) return false
  const data = await downloadGameData(gameId)
  return !Object.keys(data.players)
    .map((key) => data.players[key].name)
    .includes(playerName)
}

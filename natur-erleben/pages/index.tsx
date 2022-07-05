import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import SpinnerButton from "../components/SpinnerButton"
import { createGame, joinGame } from "../Firebase"

const Home: NextPage = () => {
  const [playerName, setPlayerName] = useState("")
  const [gameId, setGameId] = useState("")
  const [step, setStep] = useState(0)
  const [createMode, setCreateMode] = useState(false)
  const router = useRouter()

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography variant="h2">Natur Erleben</Typography>
          </Box>
        </Grid>
        {step == 0 ? (
          <>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setStep(1)
                  setCreateMode(true)
                }}
              >
                Spiel eröffnen
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={() => setStep(1)}>
                Spiel beitreten
              </Button>
            </Grid>
          </>
        ) : (
          <></>
        )}
        {step == 1 ? (
          <>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                onChange={(e) => setPlayerName(e.target.value)}
              ></TextField>
            </Grid>
            {!createMode ? (
              <Grid item xs={12}>
                <TextField
                  label="Spiel ID"
                  fullWidth
                  onChange={(e) => setGameId(e.target.value)}
                ></TextField>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <SpinnerButton
                fullWidth
                job={async () => {
                  if (createMode) {
                    const id = await createGame(playerName)
                    router.push("/lobby?id=" + id + "&host=true")
                    window.localStorage.setItem("name", playerName)
                  } else {
                    await joinGame(playerName, gameId)
                    router.push("/lobby?id=" + gameId + "&host=false")
                    window.localStorage.setItem("name", playerName)
                  }
                }}
                disabled={
                  createMode
                    ? playerName == ""
                    : playerName == "" && gameId == ""
                }
              >
                Weiter
              </SpinnerButton>
            </Grid>
          </>
        ) : (
          <></>
        )}
      </Grid>
    </Container>
  )
}

export default Home

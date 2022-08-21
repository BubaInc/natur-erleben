import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import {
  changeStage,
  disconnect,
  getPlayerList,
  watchPlayerList,
  watchStage,
} from "../Firebase"

export default function Lobby() {
  const router = useRouter()
  const id = router.query.id as string
  const isHost = (router.query.host as string) == "true"
  const [playerNames, setPlayerNames] = useState<string[]>([])
  useEffect(() => {
    if (!router.isReady) return
    watchPlayerList(id, (snapshot) => {
      const data = snapshot.val()
      setPlayerNames(data)
    })
    watchStage(id, (snapshot) => {
      if (snapshot.val() == 1) {
        localStorage.setItem("NumberCorrect", "0")
        router.push(
          "/stage?id=" +
            id +
            "&host=" +
            isHost.toString() +
            "&stage=" +
            snapshot.val()
        )
      }
    })
  }, [router.isReady])

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        ID: {id}
      </Typography>
      <List>
        {playerNames != null && playerNames.length != 0 ? (
          playerNames.map((name, i) => {
            return <ListItemText key={i}>{name}</ListItemText>
          })
        ) : (
          <></>
        )}
      </List>
      {isHost && playerNames != null ? (
        <SpinnerButton
          disabled={playerNames.length <= 1}
          job={() => changeStage(id, 1)}
        >
          Spiel starten
        </SpinnerButton>
      ) : (
        <></>
      )}
    </Container>
  )
}

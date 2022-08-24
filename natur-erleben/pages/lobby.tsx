import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import { changeStage, watchPlayerList, watchStage } from "../util/Firebase"
import handler, { useItems } from "../util/StorageHandler"

export default function Lobby() {
  const router = useRouter()
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const items = useItems((items) => {
    watchPlayerList(items.gameId, (snapshot) => {
      const data = snapshot.val()
      if (data != null) setPlayerNames(data.map((player: any) => player.name))
    })
    watchStage(items.gameId, (snapshot) => {
      if (snapshot.val() == 1) router.push("/stage")
    })
  })

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        ID: {items.gameId}
      </Typography>
      <List>
        {playerNames.map((name, i) => {
          return <ListItemText key={i}>{name}</ListItemText>
        })}
      </List>
      <RenderIf condition={items.isHost}>
        <SpinnerButton
          disabled={playerNames.length <= 1}
          job={() => changeStage(items.gameId, 1)}
        >
          Spiel starten
        </SpinnerButton>
      </RenderIf>
    </Container>
  )
}

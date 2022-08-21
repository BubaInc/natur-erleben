import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import { disconnect, getPlayerList, watchPlayerList } from "../Firebase"

export default function Lobby() {
  const router = useRouter()
  const id = router.query.id as string
  const isHost = router.query.host as string
  const [playerNames, setPlayerNames] = useState<string[]>([])
  useEffect(() => {
    getPlayerList(id).then((val) => setPlayerNames(val))
    watchPlayerList(id, (snapshot) => {
      const data = snapshot.val()
      setPlayerNames(data)
    })
  })

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
      {isHost ? (
        <SpinnerButton disabled={false} job={async () => {}}>
          Spiel starten
        </SpinnerButton>
      ) : (
        <></>
      )}
    </Container>
  )
}

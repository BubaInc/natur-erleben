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
  defaultGameData,
  downloadGameData,
  GameData,
  Player,
  watchGameData,
} from "../util/Firebase"
import handler from "../util/StorageHandler"

export default function Lobby() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [gameData, setGameData] = useState<GameData>(defaultGameData)
  const [cachedName, setCachedName] = useState("")

  useEffect(() => {
    setCachedName(handler.getItems().name)
    downloadGameData(handler.getItems().gameId).then((_gameData) => {
      setGameData(_gameData)
      watchGameData(handler.getItems().gameId, (data) => {
        setPlayers(data.players)
        if (data.stage == 1) router.push("/stage")
      })
    })
    // watchPlayerList(gameData.gameId, (snapshot) => {
    //   const data = snapshot.val()
    //   if (data != null) setPlayerNames(data.map((player: any) => player.name))
    // })
    // watchStage(gameData.gameId, (snapshot) => {
    //   if (snapshot.val() == 1) router.push("/stage")
    // })
  }, [])

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        ID: {gameData.gameId}
      </Typography>
      <List>
        {players.map((player, i) => {
          return <ListItemText key={i}>{player.name}</ListItemText>
        })}
      </List>
      <RenderIf condition={gameData.host == cachedName}>
        <SpinnerButton
          disabled={players.length <= 1}
          job={() => changeStage(gameData.gameId, 1)}
        >
          Spiel starten
        </SpinnerButton>
      </RenderIf>
    </Container>
  )
}

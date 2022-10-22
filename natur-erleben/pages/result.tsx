import List from "@mui/material/List"
import Container from "@mui/material/Container"
import ListItemText from "@mui/material/ListItemText"
import { useEffect, useState } from "react"
import { downloadGameData, GameData, Player } from "../util/Firebase"
import { getItem } from "../util/StorageHandler"
import Typography from "@mui/material/Typography"

export default function Result() {
  const [gameData, setGameData] = useState(new GameData("", "", -1, {}))
  useEffect(() => {
    const cachedGameId = getItem("gameId")
    if (!cachedGameId) return
    downloadGameData(cachedGameId).then((data) => setGameData(data))
  }, [])
  return (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        Endergebnis:
      </Typography>
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
    </Container>
  )
}

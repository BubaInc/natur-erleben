import List from "@mui/material/List"
import Container from "@mui/material/Container"
import ListItemText from "@mui/material/ListItemText"
import { useState } from "react"
import { watchPlayerList } from "../util/Firebase"
import { useItems } from "../util/StorageHandler"

export default function Result() {
  const items = useItems((items) => {
    watchPlayerList(items.gameId, (snapshot) => {
      if (snapshot.val() == null) return
      setPlayerData(snapshot.val())
    })
  })
  const [playerData, setPlayerData] = useState<any>([])
  return (
    <Container maxWidth="sm">
      <List>
        {[...playerData]
          .sort((a: any, b: any) => b.numberCorrect - a.numberCorrect)
          .map((player: any, i: number) => (
            <ListItemText key={i}>
              {player.name + " " + player.numberCorrect}
            </ListItemText>
          ))}
      </List>
    </Container>
  )
}

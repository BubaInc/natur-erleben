import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { onValue, set } from "firebase/database"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import { downloadGameData, GameData, Player, reference } from "../util/Firebase"
import { getItem } from "../util/StorageHandler"

export default function Lobby() {
  const router = useRouter()
  const [players, setPlayers] = useState<string[]>([])
  const [gameData, setGameData] = useState(new GameData("", "", -1, {}))
  const [myName, setMyName] = useState("")

  useEffect(() => {
    const cachedName = getItem("name")
    const cachedGameId = getItem("gameId")
    if (!cachedName || !cachedGameId) return
    setMyName(cachedName)
    downloadGameData(cachedGameId).then((data) => {
      setGameData(data)
      // Check if the game has started or if the player list has updated
      onValue(reference("games/" + cachedGameId), (snapshot) => {
        const value = snapshot.val()
        setGameData(value)
        setPlayers(
          Object.keys(value.players).map((key) => value.players[key].name)
        )
        if (value.stage == 1) router.push("/stage")
      })
    })
  }, [])

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        ID: {gameData.gameId}
      </Typography>
      <List>
        {players.map((player, i) => {
          return <ListItemText key={i}>{player}</ListItemText>
        })}
      </List>
      <RenderIf condition={gameData.host == myName}>
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

const changeStage = async (gameId: string, newStage: number) => {
  const stageRef = reference("games/" + gameId + "/stage")
  await set(stageRef, newStage)
}

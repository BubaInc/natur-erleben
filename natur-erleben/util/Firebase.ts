import { initializeApp } from "firebase/app"
import { get, getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
  databaseURL:
    "https://natur-erleben-221d4-default-rtdb.europe-west1.firebasedatabase.app/",
}

export const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

export class GameData {
  gameId: string
  host: string
  stage: number
  players: any
  constructor(gameId: string, host: string, stage: number, players: any) {
    this.gameId = gameId
    this.host = host
    this.stage = stage
    this.players = players
  }
}

export class Player {
  name: string
  numberCorrect: number
  ready: boolean
  answerStatus: "none" | "correct" | "wrong" | "timeout"
  constructor(
    name: string,
    numberCorrect: number,
    ready: boolean,
    answerStatus: "none" | "correct" | "wrong" | "timeout"
  ) {
    this.name = name
    this.numberCorrect = numberCorrect
    this.ready = ready
    this.answerStatus = answerStatus
  }
}

export const downloadGameData = async (gameId: string) =>
  (await get(ref(database, "games/" + gameId))).val() as GameData

export const uploadGameData = async (gameId: string, data: GameData) =>
  await set(ref(database, "games/" + gameId), data)

export const downloadPlayerData = async (gameId: string, player: string) => {
  return (
    await get(
      ref(
        database,
        "games/" +
          gameId +
          "/players/" +
          findPlayerId(await downloadGameData(gameId), player)
      )
    )
  ).val()
}

export const uploadPlayerData = async (
  gameId: string,
  player: string,
  data: Player
) =>
  await set(
    ref(
      database,
      "games/" +
        gameId +
        "/players/" +
        findPlayerId(await downloadGameData(gameId), player)
    ),
    data
  )

export const reference = (path: string) => ref(database, path)

export const findPlayerId = (gameData: GameData, playerName: string) =>
  Object.keys(gameData.players).filter(
    (key) => gameData.players[key].name == playerName
  )[0]

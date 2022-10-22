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

export const downloadPlayerData = async (gameId: string, player: string) =>
  (await get(ref(database, "games/" + gameId + "/players/" + player))).val()

export const uploadPlayerData = async (
  gameId: string,
  player: string,
  data: Player
) => await set(ref(database, "games/" + gameId + "/players/" + player), data)

export const reference = (path: string) => ref(database, path)

// export const defaultGameData: GameData = {
//   gameId: "",
//   host: "",
//   stage: 0,
//   players: [],
// }

// export const downloadGameData = async (gameId: string): Promise<GameData> => {
//   const gameRef = ref(database, "games/" + gameId)
//   const data = (await get(gameRef)).val()
//   return data
// }

// export const uploadGameData = async (gameId: string, gameData: GameData) => {
//   const gameRef = ref(database, "games/" + gameId)
//   await set(gameRef, gameData)
// }

// export const watchGameData = async (
//   gameId: string,
//   listener: (gameData: GameData) => unknown
// ) => {
//   const gameRef = ref(database, "games/" + gameId)
//   onValue(gameRef, (snapshot) => {
//     if (snapshot.val() != null) listener(snapshot.val() as GameData)
//   })
// }

// export const setAnswerStatus = async (
//   gameId: string,
//   playerName: string,
//   answerStatus: string
// ) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const data = (await get(playersRef)).val()
//   const newData = data.map((player: any) => {
//     if (player.name == playerName)
//       return Object.assign(player, { answerStatus: answerStatus })
//     else return player
//   })
//   await set(playersRef, newData)
// }

// export const watchPlayerList = async (
//   gameId: string,
//   listener: (snapshot: DataSnapshot) => unknown
// ) => {
//   const playerListRef = ref(database, "games/" + gameId + "/players")
//   onValue(playerListRef, listener)
// }

// export const watchStage = async (
//   gameId: string,
//   listener: (snapshot: DataSnapshot) => unknown
// ) => {
//   const stageRef = ref(database, "games/" + gameId + "/stage")
//   onValue(stageRef, listener)
// }

// export const nextStage = async (gameId: string) => {
//   const stageRef = ref(database, "games/" + gameId + "/stage")
//   const currentStage = (await get(stageRef)).val()
//   await set(stageRef, currentStage + 1)
// }

// export const getPlayerList = async (gameId: string) =>
//   (await get(ref(database, "games/" + gameId + "/players"))).val()

// export const disconnect = async (playerName: string, gameId: string) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const data = (await get(playersRef))
//     .val()
//     .filter((name: string) => name != playerName)
//   if (data.length == 0) {
//     remove(ref(database, "games/" + gameId + "/"))
//   } else {
//     await set(playersRef, data)
//   }
// }

// export const isEveryoneReady = async (gameId: string) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const data = await get(playersRef)
//   return !data
//     .val()
//     .map((player: any) => player.ready)
//     .includes(false)
// }

// export const setReady = async (
//   gameId: string,
//   name: string,
//   ready: boolean
// ) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const players = (await get(playersRef)).val()
//   players.forEach((player: any, i: number) => {
//     if (player.name == name) players[i].ready = ready
//   })
//   await set(playersRef, players)
// }

// export const makeEveryoneUnready = async (gameId: string) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const data = (await get(playersRef)).val()
//   const newData = data.map((player: any) => {
//     return {
//       name: player.name,
//       ready: false,
//       numberCorrect: player.numberCorrect,
//     }
//   })
//   await set(playersRef, newData)
// }

// export const increaseNumberCorrect = async (gameId: string, name: string) => {
//   const playersRef = ref(database, "games/" + gameId + "/players")
//   const data = (await get(playersRef)).val()
//   data.forEach((player: any, i: number) => {
//     if (player.name == name) {
//       const newPlayer = data[i]
//       newPlayer.numberCorrect++
//       newPlayer.ready = true
//       data[i] = newPlayer
//     }
//   })
//   await set(playersRef, data)
// }

import { initializeApp } from "firebase/app"
import {
  child,
  DataSnapshot,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database"

const firebaseConfig = {
  databaseURL:
    "https://natur-erleben-221d4-default-rtdb.europe-west1.firebasedatabase.app/",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const getGameIds = async () => {
  const dbRef = ref(database)
  const snapshot = await get(child(dbRef, "games"))
  const gameIds = []
  if (snapshot.exists()) {
    const data = snapshot.val()
    for (let key in data) {
      gameIds.push(key)
    }
  }
  return gameIds
}

export const createGame = async (host: string) => {
  // get an available game id
  const ids = await getGameIds()
  let id = ""
  while (id == "" || ids.includes(id)) {
    id = generateGameId()
  }
  // upload new game entry
  await set(ref(database, "games/" + id), {
    host: host,
    players: [{ name: host, ready: true }],
    stage: 0,
  })
  return id
}

export const changeStage = async (gameId: string, newStage: number) => {
  const stageRef = ref(database, "games/" + gameId + "/stage")
  await set(stageRef, newStage)
}

const generateGameId = () => {
  const num1 = Math.floor(Math.random() * 10).toString()
  const num2 = Math.floor(Math.random() * 10).toString()
  const num3 = Math.floor(Math.random() * 10).toString()
  const num4 = Math.floor(Math.random() * 10).toString()
  return num1 + num2 + num3 + num4
}

export const watchPlayerList = async (
  gameId: string,
  listener: (snapshot: DataSnapshot) => unknown
) => {
  const playerListRef = ref(database, "games/" + gameId + "/players")
  onValue(playerListRef, listener)
}

export const watchStage = async (
  gameId: string,
  listener: (snapshot: DataSnapshot) => unknown
) => {
  const stageRef = ref(database, "games/" + gameId + "/stage")
  onValue(stageRef, listener)
}

export const nextStage = async (gameId: string) => {
  const stageRef = ref(database, "games/" + gameId + "/stage")
  const currentStage = (await get(stageRef)).val()
  await set(stageRef, currentStage + 1)
}

export const getPlayerList = async (gameId: string) =>
  (await get(ref(database, "games/" + gameId + "/players"))).val()

export const joinGame = async (playerName: string, gameId: string) => {
  const playersRef = ref(database, "games/" + gameId + "/players")
  const data = (await get(playersRef)).val()
  data.push({ name: playerName, ready: true })
  await set(playersRef, data)
}

export const disconnect = async (playerName: string, gameId: string) => {
  const playersRef = ref(database, "games/" + gameId + "/players")
  const data = (await get(playersRef))
    .val()
    .filter((name: string) => name != playerName)
  if (data.length == 0) {
    remove(ref(database, "games/" + gameId + "/"))
  } else {
    await set(playersRef, data)
  }
}

export const isPlayerNameAvailable = async (
  playerName: string,
  gameId: string
) => {
  const players = (
    await get(ref(database, "games/" + gameId + "/players"))
  ).val()
  return !players.includes(playerName)
}

export const isGameIdValid = async (gameId: string) => {
  const snapshot = await get(ref(database, "games/" + gameId))
  return snapshot.exists()
}

export const isEveryoneReady = async (gameId: string) => {
  const playersRef = ref(database, "games/" + gameId + "/players")
  const data = await get(playersRef)
  return !data
    .val()
    .map((player: any) => player.ready)
    .includes(false)
}

export const setReady = async (
  gameId: string,
  name: string,
  ready: boolean
) => {
  const readyRef = ref(
    database,
    "games/" + gameId + "/players/" + name + "/ready"
  )
  await set(readyRef, ready)
}

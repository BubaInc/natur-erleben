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
    players: [host],
  })
  return id
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

export const getPlayerList = async (gameId: string) =>
  (await get(ref(database, "games/" + gameId + "/players"))).val()

export const joinGame = async (playerName: string, gameId: string) => {
  const playersRef = ref(database, "games/" + gameId + "/players")
  const data = (await get(playersRef)).val()
  data.push(playerName)
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

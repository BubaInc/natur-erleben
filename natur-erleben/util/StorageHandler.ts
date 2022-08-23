type Field = "isHost" | "name" | "gameId" | "numberCorrect" | "stage"

const setItem = (item: Field, value: string) =>
  window.localStorage.setItem(item, value)

const getItem = (item: Field) => window.localStorage.getItem(item)

const handler = {
  createGame: (name: string, gameId: string) => {
    setItem("isHost", "true")
    setItem("name", name)
    setItem("gameId", gameId)
    setItem("numberCorrect", "0")
    setItem("stage", "1")
  },
  joinGame: (name: string, gameId: string) => {
    setItem("isHost", "false")
    setItem("name", name)
    setItem("gameId", gameId)
    setItem("numberCorrect", "0")
    setItem("stage", "1")
  },
  getItems: () => {
    return {
      isHost: getItem("isHost") == "true",
      name: getItem("name") as string,
      gameId: getItem("gameId") as string,
      numberCorrect: parseInt(getItem("numberCorrect") as string),
      stage: parseInt(getItem("stage") as string),
    }
  },
  increaseNumberCorrect: () =>
    setItem(
      "numberCorrect",
      (parseInt(getItem("numberCorrect") as string) + 1).toString()
    ),
  nextStage: (stage: number) => setItem("stage", stage.toString()),
}

export default handler

type Field =
  | "isHost"
  | "name"
  | "gameId"
  | "numberCorrect"
  | "stage"
  | "canAnswer"

const setItem = (item: Field, value: string) =>
  window.localStorage.setItem(item, value)

const getItem = (item: Field) => window.localStorage.getItem(item)

const handler = {
  init: (name: string, gameId: string, isHost: boolean) => {
    setItem("isHost", isHost.toString())
    setItem("name", name)
    setItem("gameId", gameId)
    setItem("numberCorrect", "0")
    setItem("stage", "1")
    setItem("canAnswer", "true")
  },
  getItems: () => {
    return {
      isHost: getItem("isHost") == "true",
      name: getItem("name") as string,
      gameId: getItem("gameId") as string,
      numberCorrect: parseInt(getItem("numberCorrect") as string),
      stage: parseInt(getItem("stage") as string),
      canAnswer: getItem("canAnswer") == "true",
    }
  },
  increaseNumberCorrect: () =>
    setItem(
      "numberCorrect",
      (parseInt(getItem("numberCorrect") as string) + 1).toString()
    ),
  nextStage: (stage: number) => setItem("stage", stage.toString()),
  setCanAnswer: (canAnswer: boolean) =>
    setItem("canAnswer", canAnswer.toString()),
}

export default handler

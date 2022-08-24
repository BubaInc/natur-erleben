import { useEffect, useState } from "react"

type Field =
  | "isHost"
  | "name"
  | "gameId"
  | "numberCorrect"
  | "stage"
  | "canAnswer"
  | "countdown"

type Items = {
  isHost: boolean
  name: string
  gameId: string
  numberCorrect: number
  stage: number
  canAnswer: boolean
  countdown: number
}

const setItem = (item: Field, value: string) =>
  window.localStorage.setItem(item, value)

const getItem = (item: Field) => window.localStorage.getItem(item)

const handler = {
  init: (name: string, gameId: string, isHost: boolean) => {
    window.localStorage.clear()
    setItem("isHost", isHost.toString())
    setItem("name", name)
    setItem("gameId", gameId)
    setItem("numberCorrect", "0")
    setItem("stage", "1")
    setItem("canAnswer", "true")
    setItem("countdown", "10")
  },
  getItems: () => {
    return {
      isHost: getItem("isHost") == "true",
      name: getItem("name") as string,
      gameId: getItem("gameId") as string,
      numberCorrect: parseInt(getItem("numberCorrect") as string),
      stage: parseInt(getItem("stage") as string),
      canAnswer: getItem("canAnswer") == "true",
      countdown: parseInt(getItem("countdown") as string),
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
  setCountdown: (c: number) => setItem("countdown", c.toString()),
}

export default handler

export const useItems = (onItemsReady: (i: Items) => void) => {
  const [items, setItems] = useState<Items>({
    gameId: "",
    name: "",
    isHost: false,
    numberCorrect: 0,
    stage: 1,
    canAnswer: false,
    countdown: 10,
  })
  useEffect(() => setItems(handler.getItems()), [])
  useEffect(() => {
    if (items != undefined) onItemsReady(items)
  }, [items])
  return items
}

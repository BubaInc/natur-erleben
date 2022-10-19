type Field = "name" | "gameId"

const setItem = (item: Field, value: string) =>
  window.localStorage.setItem(item, value)

const getItem = (item: Field) => window.localStorage.getItem(item)

const handler = {
  init: (name: string, gameId: string) => {
    window.localStorage.clear()
    setItem("name", name)
    setItem("gameId", gameId)
  },
  getItems: () => {
    return {
      name: getItem("name") as string,
      gameId: getItem("gameId") as string,
    }
  },
}

export default handler

// export const useItems = (onItemsReady: (i: Items) => void) => {
//   const [items, setItems] = useState<Items>({
//     gameId: "",
//     name: "",
//     isHost: false,
//     numberCorrect: 0,
//     stage: 1,
//     canAnswer: false,
//     countdown: 10,
//   })
//   useEffect(() => setItems(handler.getItems()), [])
//   useEffect(() => {
//     if (items != undefined) onItemsReady(items)
//   }, [items])
//   return items
// }

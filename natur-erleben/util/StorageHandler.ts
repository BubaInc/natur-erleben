type Field = "name" | "gameId"

export const setItem = (item: Field, value: string) =>
  window.localStorage.setItem(item, value)

export const getItem = (item: Field) => window.localStorage.getItem(item)

export const init = (name: string, gameId: string) => {
  window.localStorage.clear()
  setItem("name", name)
  setItem("gameId", gameId)
}

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

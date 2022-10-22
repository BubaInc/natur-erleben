export default function Stage() {
  return <div>Buba</div>
}

// import Alert from "@mui/material/Alert"
// import Container from "@mui/material/Container"
// import List from "@mui/material/List"
// import ListItemButton from "@mui/material/ListItemButton"
// import ListItemText from "@mui/material/ListItemText"
// import Typography from "@mui/material/Typography"
// import { useRouter } from "next/router"
// import { useEffect, useState } from "react"
// import RenderIf from "../components/RenderIf"
// import SpinnerButton from "../components/SpinnerButton"
// import Timer from "../components/Timer"
// import {
//   defaultGameData,
//   downloadGameData,
//   GameData,
//   increaseNumberCorrect,
//   makeEveryoneUnready,
//   nextStage,
//   Player,
//   setAnswerStatus,
//   setReady,
//   watchGameData,
// } from "../util/Firebase"
// import handler from "../util/StorageHandler"

// export default function Stage() {
//   const router = useRouter()
//   const [gameData, setGameData] = useState<GameData>(defaultGameData)
//   const [cachedName, setCachedName] = useState("")
//   const myPlayerData = gameData.players.filter(
//     (player) => player.name == cachedName
//   )[0]

//   useEffect(() => {
//     setCachedName(handler.getItems().name)
//     downloadGameData(handler.getItems().gameId).then((_gameData) => {
//       watchGameData(handler.getItems().gameId, (data) => {
//         // Go to result page when there is no stage left
//         if (stages[data.stage - 1] == undefined) router.push("/result")
//         else if (data.stage > gameData.stage) {
//           // Next stage has been selected
//           setAnswerStatus(gameData.gameId, cachedName, "none")
//           setCountdown(maxTime)
//         }
//         console.log("Buba")
//       })
//       setGameData(_gameData)
//     })
//   }, [])

//   const everyoneReady =
//     gameData.players.filter((player) => !player.ready).length == 0

//   const question = stages[gameData.stage - 1]
//   const answers = question ? question.answers : []

//   const maxTime = 10
//   const [countdown, setCountdown] = useState(maxTime)

//   return question != null ? (
//     <Container maxWidth="sm">
//       <Typography variant="h2" sx={{ mb: 2 }}>
//         {question.question}
//         {myPlayerData.answerStatus}
//       </Typography>
//       <RenderIf condition={myPlayerData.answerStatus == "none"}>
//         <Timer
//           countdown={countdown}
//           setCountdown={setCountdown}
//           onTimeout={async () => {
//             await setAnswerStatus(gameData.gameId, cachedName, "timeout")
//             await setReady(gameData.gameId, cachedName, true)
//           }}
//         />
//         <List>
//           {answers.map((answer, i) => (
//             <ListItemButton
//               key={i}
//               color="secondary"
//               disabled={myPlayerData.ready}
//               onClick={async () => {
//                 setReady(gameData.gameId, cachedName, true)
//                 if (answer == question.correct) {
//                   setAnswerStatus(gameData.gameId, cachedName, "correct")
//                   increaseNumberCorrect(gameData.gameId, cachedName)
//                 } else {
//                   setAnswerStatus(gameData.gameId, cachedName, "wrong")
//                 }
//               }}
//             >
//               <ListItemText>{answer}</ListItemText>
//             </ListItemButton>
//           ))}
//         </List>
//       </RenderIf>
//       <RenderIf condition={myPlayerData.answerStatus == "correct"}>
//         <Alert severity="success">Richtige Antwort!</Alert>
//       </RenderIf>
//       <RenderIf condition={myPlayerData.answerStatus == "wrong"}>
//         <Alert severity="error">Falsche Antwort!</Alert>
//       </RenderIf>
//       <RenderIf condition={myPlayerData.answerStatus == "timeout"}>
//         <Alert severity="error">Die Zeit ist abgelaufen!</Alert>
//       </RenderIf>
//       <RenderIf condition={myPlayerData.answerStatus != "none"}>
//         <List>
//           {[...gameData.players]
//             .sort((a: Player, b: Player) => b.numberCorrect - a.numberCorrect)
//             .map((player: Player, i: number) => (
//               <ListItemText key={i}>
//                 {player.name + " " + player.numberCorrect}
//               </ListItemText>
//             ))}
//         </List>
//       </RenderIf>
//       <RenderIf
//         condition={
//           myPlayerData.answerStatus != "none" && gameData.host == cachedName
//         }
//       >
//         <SpinnerButton
//           disabled={!everyoneReady}
//           job={async () => {
//             await makeEveryoneUnready(gameData.gameId)
//             await nextStage(gameData.gameId)
//             setCountdown(maxTime)
//           }}
//         >
//           Nächste Station
//         </SpinnerButton>
//       </RenderIf>
//     </Container>
//   ) : (
//     <></>
//   )
// }

// type Question = {
//   question: string
//   answers: string[]
//   correct: string[] | string
// }

// const stages: Question[] = [
//   {
//     question: "In was lässt sich ein Ahornblatt unterteilen?",
//     answers: ["Lappen", "Finger", "Spitzen", "Wischer"],
//     correct: "Lappen",
//   },
//   {
//     question: "Ist der Ahorn giftig?",
//     answers: ["Ja", "Nur für Nagetiere", "Nur für Pferde & Esel", "Nein"],
//     correct: "Nur für Pferde & Esel",
//   },
//   {
//     question: "Wo ist der Ginkgo beheimatet? Dort ist er sogar Nationalbaum!",
//     answers: ["China", "Thailand", "Dänemark", "Madagaskar"],
//     correct: "China",
//   },
//   {
//     question:
//       "Bei was soll der Ginkgo laut traditioneller chinesischer Medizin helfen?",
//     answers: ["Rückenschmerzen", "Gedächtnisprobleme", "Haarausfall", "Karies"],
//     correct: "Gedächtnisprobleme",
//   },
//   {
//     question: "Wieso werden in Parks fast nur männliche Ginkgos angebaut?",
//     answers: [
//       "die Weibchen werden nur maximal 1m hoch",
//       "die Weibchen sind nicht frosthart",
//       "die Früchte der Weibchen stinken",
//       "die Früchte der Weibchen sind giftig",
//     ],
//     correct: "die Früchte der Weibchen stinken",
//   },
//   {
//     question: "Ist die Rosskastanie essbar?",
//     answers: [
//       "Ja",
//       "Ja, jedoch ist sie ungenießbar",
//       "Nur im gekochten Zustand",
//       "Nein, sie ist giftig",
//     ],
//     correct: "Nein, sie ist giftig",
//   },
//   {
//     question: "Was kann man aus Kastanien herstellen?",
//     answers: ["Waschmittel", "Hautcreme", "Zahnpasta", "Deodorant"],
//     correct: "Waschmittel",
//   },
//   {
//     question: "Sind Zieräpfel giftig?",
//     answers: ["Ja", "Nein, jedoch ja für Haustiere", "Nein"],
//     correct: "Nein",
//   },
//   {
//     question:
//       "In welchem Jahrhundert wurde die älteste Apfelsorte, der Edelborsdorfer dokumentiert?",
//     answers: [
//       "1. Jahrhundert",
//       "6. Jahrhundert",
//       "12. Jahrhundert",
//       "18. Jahrhundert",
//     ],
//     correct: "12. Jahrhundert",
//   },
//   {
//     question:
//       "Welchen Nahrungsmitteln schauen die Samen/Früchte der Robinie ähnlich?",
//     answers: ["Walnüsse", "Bohnenhülsen", "Kirschen", "Äpfeln"],
//     correct: "Bohnenhülsen",
//   },
//   {
//     question: "Die Pflanzung der Robinie ist umstritten. Wieso?",
//     answers: [
//       "Sie ist sehr schädlingsanfällig",
//       "Sie bietet kaum Nahrung für Insekten",
//       "Sie braucht extremst viel Dünger, um überhaupt zu wachsen",
//       "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
//     ],
//     correct: "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
//   },
//   {
//     question:
//       "Wie andere Hülsenfrüchtler lebt die Robinie in Symbiose mit Knöllchenbakterien. Wieso?",
//     answers: [
//       "um Feinde abzuwehren",
//       "um witterungsbeständiger zu sein",
//       "um sich selbst zu Düngen",
//       "um Insekten anzulocken",
//     ],
//     correct: "um sich selbst zu Düngen",
//   },
//   {
//     question: "Was wurde aus den Früchten der Eberesche hergestellt?",
//     answers: ["Süßstoff", "Gift gegen Schädlinge", "Farbe", "Duftstoffe"],
//     correct: "Süßstoff",
//   },
//   {
//     question: "Woher kommen die Namen Vogelbeere bzw. Eberesche? (2 Anworten)",
//     answers: [
//       "Sie ist verwandt mit der Esche",
//       "Die Blätter ähneln denen der Esche",
//       "Vögel lieben die Früchte",
//       "Die Beeren sind höchst giftig für Vögel",
//     ],
//     correct: ["Die Blätter ähneln denen der Esche", "Vögel lieben die Früchte"],
//   },
//   {
//     question: "Sind Vogelbeeren giftig?",
//     answers: [
//       "Ja, jedoch sind sie sicher für Haustiere",
//       "Nein, jedoch ja für Haustiere",
//     ],
//     correct: "Nein, jedoch ja für Haustiere",
//   },
//   {
//     question: "Die Linde ist für Insekten sehr wichtig. Wieso?",
//     answers: [
//       "sie ist ein Sommerblüher, was sehr selten ist",
//       "sie hat 10-mal so viele Blüten wie die meisten anderen Laubbäume",
//       "sie zieht viele seltene Arten an",
//     ],
//     correct: "sie ist ein Sommerblüher, was sehr selten ist",
//   },
//   {
//     question: "Wobei hilft Lindenblütentee?",
//     answers: [
//       "Bauchschmerzen",
//       "Erkältung",
//       "Hustenreiz",
//       "Konzentrationsschwächen",
//     ],
//     correct: "Erkältung",
//   },
//   {
//     question:
//       "Die Dorflinde, welche früher das Zentrum eines Dorfs darstellte, hatte auch folgende Namen:",
//     answers: ["Festbaum", "Gerichtslinde", "Hochzeitslinde", "Tanzlinde"],
//     correct: ["Gerichtslinde", "Tanzlinde"],
//   },
//   {
//     question: "Was wurde früher in Notzeiten aus Eicheln hergestellt?",
//     answers: ["Seife", "Öl", "Kaffee", "Mehl"],
//     correct: ["Kaffee", "Mehl"],
//   },
// ]

// const shuffle = (a: any[]) => {
//   var j, x, i
//   for (i = a.length - 1; i > 0; i--) {
//     j = Math.floor(Math.random() * (i + 1))
//     x = a[i]
//     a[i] = a[j]
//     a[j] = x
//   }
//   return a
// }

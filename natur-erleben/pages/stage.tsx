import Alert from "@mui/material/Alert"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import RenderIf from "../components/RenderIf"
import SpinnerButton from "../components/SpinnerButton"
import Timer from "../components/Timer"
import {
  increaseNumberCorrect,
  makeEveryoneUnready,
  nextStage,
  setReady,
  watchPlayerList,
  watchStage,
} from "../util/Firebase"
import handler, { useItems } from "../util/StorageHandler"

export default function Stage() {
  const router = useRouter()
  const items = useItems((items) => {
    if (items.stage != undefined) setStage(items.stage)
    watchStage(items.gameId, async (snapshot) => {
      if (snapshot.val() == undefined) return
      if (stages[snapshot.val()] == undefined) {
        router.push("/result")
      } else if (snapshot.val() > stage) {
        setStage(snapshot.val())
        setAnswerStatus("none")
        setCountdown(maxTime)
        handler.setCanAnswer(true)
        setEveryoneReady(false)
      }
    })
    watchPlayerList(items.gameId, (snapshot) => {
      if (snapshot.val() == null) return
      setIAmReady(
        snapshot.val().filter((player: any) => player.name == items.name)[0]
          .ready
      )
      setEveryoneReady(
        !snapshot
          .val()
          .map((player: any) => player.ready)
          .includes(false)
      )
      setPlayerData(snapshot.val())
    })
  })

  const [playerData, setPlayerData] = useState<any>([])

  const [stage, setStage] = useState(1)

  const question = stages[stage]
  const [answers, setAnswers] = useState<string[]>([])
  useEffect(() => setAnswers(shuffle(question.answers)), [stage])

  type AnswerStatus = "none" | "correct" | "wrong" | "timeout"
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("none")

  const [everyoneReady, setEveryoneReady] = useState(false)
  const [iAmReady, setIAmReady] = useState(false)

  const maxTime = 10
  const [countdown, setCountdown] = useState(maxTime)

  useEffect(() => {
    addEventListener(
      "beforeunload",
      async (event) => {
        await setReady(items.gameId, items.name, true)
      },
      { capture: true }
    )
  }, [])

  return question != null ? (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      <RenderIf condition={answerStatus == "none"}>
        <Timer
          countdown={countdown}
          setCountdown={setCountdown}
          onTimeout={() => {
            setAnswerStatus("timeout")
            setEveryoneReady(true)
            setReady(items.gameId, items.name, true)
            handler.setCanAnswer(false)
          }}
        />
        <List>
          {answers.map((answer, i) => (
            <ListItemButton
              key={i}
              color="secondary"
              disabled={iAmReady}
              onClick={async () => {
                setReady(items.gameId, items.name, true)
                if (answer == question.correct) {
                  setAnswerStatus("correct")
                  handler.increaseNumberCorrect()
                  increaseNumberCorrect(items.gameId, items.name)
                } else {
                  setAnswerStatus("wrong")
                }
              }}
            >
              <ListItemText>{answer}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      </RenderIf>
      <RenderIf condition={answerStatus == "correct"}>
        <Alert severity="success">Richtige Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus == "wrong"}>
        <Alert severity="error">Falsche Antwort!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus == "timeout"}>
        <Alert severity="error">Die Zeit ist abgelaufen!</Alert>
      </RenderIf>
      <RenderIf condition={answerStatus != "none"}>
        <List>
          {[...playerData]
            .sort((a: any, b: any) => b.numberCorrect - a.numberCorrect)
            .map((player: any, i: number) => (
              <ListItemText key={i}>
                {player.name + " " + player.numberCorrect}
              </ListItemText>
            ))}
        </List>
      </RenderIf>
      <RenderIf condition={answerStatus != "none" && items.isHost}>
        <SpinnerButton
          disabled={!everyoneReady}
          job={async () => {
            await makeEveryoneUnready(items.gameId)
            await nextStage(items.gameId)
            setCountdown(maxTime)
          }}
        >
          Nächste Station
        </SpinnerButton>
      </RenderIf>
    </Container>
  ) : (
    <></>
  )
}

const stages: any = {
  1: {
    question: "In was lässt sich ein Ahornblatt unterteilen?",
    answers: ["Lappen", "Finger", "Spitzen", "Wischer"],
    correct: "Lappen",
  },

  2: {
    question: "Ist der Ahorn giftig?",
    answers: ["Ja", "Nur für Nagetiere", "Nur für Pferde & Esel", "Nein"],
    correct: "Nur für Pferde & Esel",
  },

  3: {
    question: "Wo ist der Ginkgo beheimatet? Dort ist er sogar Nationalbaum!",
    answers: ["China", "Thailand", "Dänemark", "Madagaskar"],
    correct: "China",
  },

  4: {
    question:
      "Bei was soll der Ginkgo laut traditioneller chinesischer Medizin helfen?",
    answers: ["Rückenschmerzen", "Gedächtnisprobleme", "Haarausfall", "Karies"],
    correct: "Gedächtnisprobleme",
  },

  5: {
    question: "Wieso werden in Parks fast nur männliche Ginkgos angebaut?",
    answers: [
      "die Weibchen werden nur maximal 1m hoch",
      "die Weibchen sind nicht frosthart",
      "die Früchte der Weibchen stinken",
      "die Früchte der Weibchen sind giftig",
    ],
    correct: "die Früchte der Weibchen stinken",
  },

  6: {
    question: "Ist die Rosskastanie essbar?",
    answers: [
      "Ja",
      "Ja, jedoch ist sie ungenießbar",
      "Nur im gekochten Zustand",
      "Nein, sie ist giftig",
    ],
    correct: "Nein, sie ist giftig",
  },

  7: {
    question: "Was kann man aus Kastanien herstellen?",
    answers: ["Waschmittel", "Hautcreme", "Zahnpasta", "Deodorant"],
    correct: "Waschmittel",
  },

  8: {
    question: "Sind Zieräpfel giftig?",
    answers: ["Ja", "Nein, jedoch ja für Haustiere", "Nein"],
    correct: "Nein",
  },

  9: {
    question:
      "In welchem Jahrhundert wurde die älteste Apfelsorte, der Edelborsdorfer dokumentiert?",
    answers: [
      "1. Jahrhundert",
      "6. Jahrhundert",
      "12. Jahrhundert",
      "18. Jahrhundert",
    ],
    correct: "12. Jahrhundert",
  },

  10: {
    question:
      "Welchen Nahrungsmitteln schauen die Samen/Früchte der Robinie ähnlich?",
    answers: ["Walnüsse", "Bohnenhülsen", "Kirschen", "Äpfeln"],
    correct: "Bohnenhülsen",
  },

  11: {
    question: "Die Pflanzung der Robinie ist umstritten. Wieso?",
    answers: [
      "Sie ist sehr schädlingsanfällig",
      "Sie bietet kaum Nahrung für Insekten",
      "Sie braucht extremst viel Dünger, um überhaupt zu wachsen",
      "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
    ],
    correct: "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
  },

  12: {
    question:
      "Wie andere Hülsenfrüchtler lebt die Robinie in Symbiose mit Knöllchenbakterien. Wieso?",
    answers: [
      "um Feinde abzuwehren",
      "um witterungsbeständiger zu sein",
      "um sich selbst zu Düngen",
      "um Insekten anzulocken",
    ],
    correct: "um sich selbst zu Düngen",
  },

  13: {
    question: "Was wurde aus den Früchten der Eberesche hergestellt?",
    answers: ["Süßstoff", "Gift gegen Schädlinge", "Farbe", "Duftstoffe"],
    correct: "Süßstoff",
  },

  14: {
    question: "Woher kommen die Namen Vogelbeere bzw. Eberesche? (2 Anworten)",
    answers: [
      "Sie ist verwandt mit der Esche",
      "Die Blätter ähneln denen der Esche",
      "Vögel lieben die Früchte",
      "Die Beeren sind höchst giftig für Vögel",
    ],
    correct: ["Die Blätter ähneln denen der Esche", "Vögel lieben die Früchte"],
  },

  15: {
    question: "Sind Vogelbeeren giftig?",
    answers: [
      "Ja, jedoch sind sie sicher für Haustiere",
      "Nein, jedoch ja für Haustiere",
    ],
    correct: "Nein, jedoch ja für Haustiere",
  },

  16: {
    question: "Die Linde ist für Insekten sehr wichtig. Wieso?",
    answers: [
      "sie ist ein Sommerblüher, was sehr selten ist",
      "sie hat 10-mal so viele Blüten wie die meisten anderen Laubbäume",
      "sie zieht viele seltene Arten an",
    ],
    correct: "sie ist ein Sommerblüher, was sehr selten ist",
  },

  17: {
    question: "Wobei hilft Lindenblütentee?",
    answers: [
      "Bauchschmerzen",
      "Erkältung",
      "Hustenreiz",
      "Konzentrationsschwächen",
    ],
    correct: "Erkältung",
  },

  18: {
    question:
      "Die Dorflinde, welche früher das Zentrum eines Dorfs darstellte, hatte auch folgende Namen:",
    answers: ["Festbaum", "Gerichtslinde", "Hochzeitslinde", "Tanzlinde"],
    correct: ["Gerichtslinde", "Tanzlinde"],
  },

  19: {
    question: "Was wurde früher in Notzeiten aus Eicheln hergestellt?",
    answers: ["Seife", "Öl", "Kaffee", "Mehl"],
    correct: ["Kaffee", "Mehl"],
  },
}

const shuffle = (a: any[]) => {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

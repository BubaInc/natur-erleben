import Alert from "@mui/material/Alert"
import Container from "@mui/material/Container"
import List from "@mui/material/List"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
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
  const items = useItems((items) => {
    if (items.stage != undefined) setStage(items.stage)
    watchStage(items.gameId, async (snapshot) => {
      if (snapshot.val() > stage) {
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
      setPlayerData(snapshot.val())
    })
  })

  const [playerData, setPlayerData] = useState<any>([])

  useEffect(
    () =>
      setEveryoneReady(
        !playerData.map((player: any) => player.ready).includes(false)
      ),
    [playerData]
  )

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
                if (answer == question.right) {
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
    question: "Wie heißt die Mutter von Nicki Lauda?",
    answers: ["Mama Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  2: {
    question: "Wie heißt der Vater von Nicki Lauda?",
    answers: ["Papa Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  3: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  4: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  5: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  6: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  7: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  8: {
    question: "Wie heißt der Bruder von Nicki Lauda?",
    answers: ["Bruder Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
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

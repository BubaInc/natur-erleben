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
import { nextStage, watchStage } from "../util/Firebase"
import handler from "../util/StorageHandler"

export default function Stage() {
  const router = useRouter()

  const [items, setItems] = useState<any>({})
  useEffect(() => setItems(handler.getItems()), [])
  useEffect(() => {
    watchStage(items.gameId, (snapshot) => {
      if (stage == snapshot.val() - 1) {
        setStage(stage + 1)
        setAnswerStatus("none")
      }
    })
  }, [items])

  const [stage, setStage] = useState(1)

  const question = stages[stage]
  useEffect(() => setAnswers(shuffle(question.answers)), [stage])
  const [answers, setAnswers] = useState<string[]>([])

  type AnswerStatus = "none" | "correct" | "wrong"
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>("none")

  return question != null ? (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      {answerStatus == "none" ? (
        <List>
          {answers.map((answer, i) => (
            <ListItemButton
              key={i}
              color="secondary"
              onClick={() => {
                if (answer == question.right) {
                  setAnswerStatus("correct")
                  handler.increaseNumberCorrect()
                } else {
                  setAnswerStatus("wrong")
                }
              }}
            >
              <ListItemText>{answer}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <>
          {answerStatus == "correct" ? (
            <Alert severity="success">Richtige Antwort!</Alert>
          ) : (
            <Alert severity="error">Falsche Antwort!</Alert>
          )}
          <RenderIf condition={items.isHost}>
            <SpinnerButton disabled={false} job={() => nextStage(items.gameId)}>
              Nächste Station
            </SpinnerButton>
          </RenderIf>
        </>
      )}
    </Container>
  ) : (
    <></>
  )
}

const stages: any = {
  "1": {
    question: "Wie heißt die Mutter von Nicki Lauda?",
    answers: ["Mama Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  "2": {
    question: "Wie heißt der Vater von Nicki Lauda?",
    answers: ["Papa Lauda", "rgehouip", "sjzt", "hvfrgzyd"],
    right: "Mama Lauda",
  },
  "3": {
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

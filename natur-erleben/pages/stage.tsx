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
import { nextStage, watchStage } from "../Firebase"

export default function Stage() {
  const router = useRouter()
  const stage = router.query.stage as string
  const id = router.query.id as string
  const isHost = (router.query.host as string) == "true"
  const question = stages[stage]
  type AnswerStatus = "none" | "correct" | "wrong"
  const [questionAnswered, setQuestionAnswered] = useState<AnswerStatus>("none")
  useEffect(() => {
    if (!router.isReady) return
    watchStage(id, (snapshot) => {
      if (parseInt(stage) == snapshot.val() - 1) {
        router.push(
          "/stage?id=" +
            id +
            "&host=" +
            isHost.toString() +
            "&stage=" +
            snapshot.val()
        )
        router.reload()
      }
    })
  }, [router.isReady])

  return question != null ? (
    <Container maxWidth="sm">
      <Typography variant="h2" sx={{ mb: 2 }}>
        {question.question}
      </Typography>
      {questionAnswered == "none" ? (
        <List>
          {shuffle(question.answers).map((answer, i) => (
            <ListItemButton
              key={i}
              color="secondary"
              onClick={() => {
                if (answer == question.right) {
                  setQuestionAnswered("correct")
                  increaseNumberCorrect()
                } else {
                  setQuestionAnswered("wrong")
                }
              }}
            >
              <ListItemText>{answer}</ListItemText>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <>
          {questionAnswered == "correct" ? (
            <Alert severity="success">Richtige Antwort!</Alert>
          ) : (
            <Alert severity="error">Falsche Antwort!</Alert>
          )}
          <RenderIf condition={isHost}>
            <SpinnerButton disabled={false} job={() => nextStage(id)}>
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

const increaseNumberCorrect = () =>
  localStorage.setItem(
    "NumberCorrect",
    (parseInt(localStorage.getItem("NumberCorrect") as string) + 1).toString()
  )

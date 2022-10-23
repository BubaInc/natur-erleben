import Typography from "@mui/material/Typography"
import { Dispatch, SetStateAction, useEffect } from "react"
import RenderIf from "../RenderIf"

export default function Timer({
  enabled,
  countdown,
  setCountdown,
  onTimeout,
}: {
  enabled: boolean
  countdown: number
  setCountdown: Dispatch<SetStateAction<number>>
  onTimeout: () => void
}) {
  useEffect(() => {
    if (countdown == 0) {
      if (enabled) onTimeout()
    } else {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])
  return (
    <RenderIf condition={enabled}>
      <Typography variant="h3">{countdown}</Typography>
    </RenderIf>
  )
}

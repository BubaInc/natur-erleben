import Typography from "@mui/material/Typography"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import handler from "../../util/StorageHandler"

export default function Timer({
  countdown,
  setCountdown,
  onTimeout,
}: {
  countdown: number
  setCountdown: Dispatch<SetStateAction<number>>
  onTimeout: () => void
}) {
  useEffect(() => {
    if (countdown == 0) {
      onTimeout()
    } else {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [countdown])
  return <Typography variant="h3">{countdown}</Typography>
}

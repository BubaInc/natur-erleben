import { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./Timer.module.css";

export default function Timer({
  enabled,
  countdown,
  setCountdown,
  onTimeout,
}: {
  enabled: boolean;
  countdown: number;
  setCountdown: Dispatch<SetStateAction<number>>;
  onTimeout: () => void;
}) {
  useEffect(() => {
    if (countdown == 0) {
      if (enabled) onTimeout();
    } else {
      const timer = setInterval(() => setCountdown(countdown - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);
  return <p className={styles.timer}>{enabled ? countdown : ""}</p>;
}

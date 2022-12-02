import { GameData } from "../../util/Firebase";
import { Question } from "../../util/Stages";
import RenderIf from "../RenderIf";
import SpinnerButton from "../SpinnerButton";
import styles from "./NextStep.module.css";

export default function NextStep({
  question,
  nextStage,
  isEveryoneReady,
  makeEveryoneUnready,
  gameData,
  isHost,
}: {
  question: Question;
  nextStage: (gameId: string) => Promise<void>;
  isEveryoneReady: (gameData: GameData) => boolean;
  makeEveryoneUnready: (gameId: string) => Promise<void>;
  gameData: GameData;
  isHost: boolean;
}) {
  return (
    <div className={styles.container}>
      Geht jetzt weiter zu Station {question.correct}
      <RenderIf condition={isHost}>
        <SpinnerButton
          disabled={false}
          job={async () => {
            await makeEveryoneUnready(gameData.gameId);
            await nextStage(gameData.gameId);
          }}
        >
          Nächste Frage
        </SpinnerButton>
      </RenderIf>
    </div>
  );
}

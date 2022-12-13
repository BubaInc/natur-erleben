import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import styles from "./Minimap.module.css";

export default function Minimap({
  setVisible,
}: {
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className={styles.container}>
      <Image
        onClick={() => setVisible(false)}
        className={styles.image}
        src="/Map.png"
        width={1158}
        height={763}
      />
    </div>
  );
}

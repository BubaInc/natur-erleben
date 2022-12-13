import styles from "./MapButton.module.css";
import MapIcon from "@mui/icons-material/Map";
import Button from "../Button";
import { MouseEventHandler } from "react";

export default function MapButton({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button mapButton onClick={onClick}>
      <MapIcon />
    </Button>
  );
}

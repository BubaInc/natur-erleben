import styles from "./MapButton.module.css";
import MapIcon from "@mui/icons-material/Map";
import Button from "../Button";

export default function MapButton() {
  return (
    <Button mapButton onClick={() => {}}>
      <MapIcon />
    </Button>
  );
}

import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "../Button";

type Props = {
  disabled: boolean;
  job: () => Promise<void>;
  children: any;
  onComplete?: () => void;
  fullWidth?: boolean;
};

export default function SpinnerButton({
  disabled,
  job,
  children,
  onComplete,
  fullWidth,
}: Props) {
  const [showSpinner, setShowSpinner] = useState(false);
  return (
    <>
      {showSpinner ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Button
          onClick={async () => {
            setShowSpinner(true);
            if (job) await job();
            setShowSpinner(false);
            if (onComplete) onComplete();
          }}
          disabled={disabled}
        >
          {children}
        </Button>
      )}
    </>
  );
}

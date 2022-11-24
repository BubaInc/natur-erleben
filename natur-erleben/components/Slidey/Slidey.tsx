import { useState } from "react";
import styles from "./Slidey.module.css";

export default function Slidey({
  children,
  open,
}: {
  children: any;
  open: boolean;
}) {
  return (
    <>
      <style jsx>{`
        .slidey {
          position: absolute;
          top: 199px;
          width: 100%;
          height: calc(100vh - 199px);
          background-color: #f9f9f9;
          border-radius: 30px 30px 0 0;

          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;

          transform: translateY(${open ? "0" : "100%"});
          transition: transform 1s;
        }
      `}</style>
      <div className="slidey">{children}</div>
    </>
  );
}

export function useSlidey() {
  const [open, setOpen] = useState(true);
  function changeSlidey(delayedAction: () => void) {
    setOpen(false);
    setTimeout(() => {
      delayedAction();
      setOpen(true);
    }, 1500);
  }

  return {
    open: open,
    changeSlidey: changeSlidey,
  };
}

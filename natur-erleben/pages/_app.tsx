import "../styles/globals.css";
import type { AppProps } from "next/app";
import MapButton from "../components/MapButton";
import Minimap from "../components/Minimap";
import { useState } from "react";
import RenderIf from "../components/RenderIf";

function MyApp({ Component, pageProps }: AppProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Component {...pageProps} />
      <MapButton onClick={() => setVisible(true)} />
      <RenderIf condition={visible}>
        <Minimap setVisible={setVisible} />
      </RenderIf>
    </>
  );
}

export default MyApp;

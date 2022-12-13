import "../styles/globals.css";
import type { AppProps } from "next/app";
import MapButton from "../components/MapButton";
import Image from "next/image";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <MapButton />
      <Image src="" width={500} height={500}></Image>
    </>
  );
}

export default MyApp;

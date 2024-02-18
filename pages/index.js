import Head from "next/head";
import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Topbar />
      </main>
    </>
  );
}

import Head from "next/head";
import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";
import Card from "@/components/Card";

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
          <div className={`${styles.grid}`}>
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          <Card name="VIVA - Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
        </div>
      </main>
    </>
  );
}

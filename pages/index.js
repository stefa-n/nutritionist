import Head from "next/head";
import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";
import Card from "@/components/Card";

import { createClient } from "@supabase/supabase-js";
export const supabase = createClient('https://devjuheafwjammjnxthd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODI4MTg5MiwiZXhwIjoyMDIzODU3ODkyfQ.RHiqiCEAMLAoJVJ-F07Hcby3MmjR5HpC_su0DbDsFS4')

export default function Home({ products }) {
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
          <Card brand="VIVA" name="Pernuțe umplute cu cremă de cacao" image="https://shopius.ro/wp-content/uploads/2020/11/sc3f9rs_viva_pernite_cacao_100g_1.png" calories={70} nutriscore="E" novascore={2} />
          {products.map((product) => (
            <Card brand={product.brand} name={product.product_name} image={product.image} calories={product.kcal} nutriscore={0} novascore={0} />
          ))}
        </div>
      </main>
    </>
  );
}
export async function getServerSideProps() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  const produse = data;

  for (let i = 0; i < data.length; i++) {
    const { data } = supabase
      .storage
      .from('products')
      .getPublicUrl('5449000306821.jpg')

    console.log(data.publicUrl)
    produse[i].image = `${data.publicUrl}`
  }

  return {
    props: {
      products: produse
    }
  }
}
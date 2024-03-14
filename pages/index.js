import Head from "next/head";

import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";

import Card from "@/components/Card";
import Produs from "@/components/Produs";

import { createClient } from "@supabase/supabase-js";
export const supabase = createClient('https://devjuheafwjammjnxthd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODI4MTg5MiwiZXhwIjoyMDIzODU3ODkyfQ.RHiqiCEAMLAoJVJ-F07Hcby3MmjR5HpC_su0DbDsFS4')

var products = [];

export default function Home({ products }) {
  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Topbar value=""/>
        <div className={`${styles.grid}`}>
          {products.map((product) => (
              <div key={product.id}>
                <Card key={product.id} brand={product.brand} name={product.product_name} image={product.image} calories={product.kcal} nutriscore={0} novascore={0} onClick={() => {
                  document.getElementsByClassName("product." + product.id)[0].style.display = "flex"
                }}/>
                <div className={"product." + product.id} style={{display: "none", position: "absolute", zIndex: "100", top: "0", left: "0", width: "100%", height: "100%"}}>
                  <Produs produs={product} />
                </div>
              </div>
          ))}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps() {
  if (products.length > 0) {
    return {
      props: {
        products: products
      }
    }
  }
  
  const { data, error } = await supabase
    .from('products')
    .select('*')

  const produse = data;

  console.log("\n\nGetting products from database")

  for (let i = 0; i < data.length; i++) {
    const { data } = supabase
      .storage
      .from('products')
      .getPublicUrl(`${produse[i].barcode}.${produse[i].image_format}`)

    console.log(data.publicUrl)
    produse[i].image = `${data.publicUrl}`
  }

  products = produse;

  clearProducts();

  return {
    props: {
      products: produse
    }
  }
}

async function clearProducts() {
  setTimeout(() => {
    products = [];
  }, 6000);
}
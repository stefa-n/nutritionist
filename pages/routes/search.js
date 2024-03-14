import Head from "next/head";
import { useState } from "react";

import { supabase } from "@/pages/index";
import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import Produs from "@/components/Produs";

export default function Search({ query, products }) {
  const cautare = query;

  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Topbar value={cautare}/>
        <div className={`${styles.grid}`}>
          {products.map((product) => (
            <div key={product.id}>
              <Card key={product.id} barcode={product.barcode} brand={product.brand} name={product.product_name} image={product.image} calories={product.kcal} nutriscore={0} novascore={0} onClick={() => {
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

export async function getServerSideProps(context) {
    const { query } = context.query;

    var { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('approved', true)

    const produse = data.filter(obj => {
        for (let key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                continue;
              }
            if (obj[key].toString().toLowerCase().includes(query.toLowerCase())) {
                return true;
            }
        }
        return false;
    });

    produse.forEach(produs => {
        const { data } = supabase
            .storage
            .from('products')
            .getPublicUrl(`${produs.barcode}.${produs.image_format}`)
        produs.image = data.publicUrl;
    })

    return {
        props: {
            query: query,
            products: produse
        }
    }
}
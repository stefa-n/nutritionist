import Head from "next/head";

import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";

import Card from "@/components/Card";
import Produs from "@/components/Produs";
import Submission from "@/components/Submission";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
export const supabase = createClient(
  "https://devjuheafwjammjnxthd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M"
);

export default function Home() {
  const [products, setProducts] = useState([]);
  const fetchProduse = async (query = "") => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("approved", true)
      .or(`brand.ilike."%${query}%", product_name.ilike."%${query}%"`)
      .order("health_score", { ascending: false });
    const produse = data;

    for (let i = 0; i < data.length; i++) {
      const { data } = supabase.storage
        .from("products")
        .getPublicUrl(`${produse[i].id}.${produse[i].image_format}`);

      produse[i].image = `${data.publicUrl}`;
    }

    setProducts(produse);
  };

  useEffect(() => {
    fetchProduse();
  }, []);
  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <Topbar value="" onSearch={fetchProduse} />
        <div className={`${styles.grid}`}>
          {products.map((product) => (
            <div key={product.id}>
              <Card
                barcode={product.barcode}
                key={product.id}
                brand={product.brand}
                name={product.product_name}
                image={product.image}
                calories={product.kcal}
                healthScore={product.health_score}
                id={product.id}
                onClick={() => {
                  document.getElementsByClassName(
                    "product." + product.id
                  )[0].style.display = "flex";
                }}
              />
              <div
                className={"product." + product.id}
                style={{
                  display: "none",
                  position: "absolute",
                  zIndex: "100",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Produs produs={product} onVote={fetchProduse} />
              </div>
            </div>
          ))}
        </div>
      </main>
      <Submission />
    </>
  );
}

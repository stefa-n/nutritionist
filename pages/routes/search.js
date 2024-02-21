import Head from "next/head";
import { useRouter } from "next/router";

import { supabase } from "@/pages/index";
import styles from "@/styles/Home.module.css";

import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import Produs from "@/components/produs";

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
            <div>
              <Card key={product.id} brand={product.brand} name={product.product_name} image={product.image} calories={product.kcal} nutriscore={0} novascore={0} onClick={() => {
                document.getElementsByClassName("product." + product.id)[0].style.display = "flex"
              }}/>
              <div className={"product." + product.id} style={{display: "none", position: "absolute", zIndex: "100", top: "0", left: "0", width: "100%", height: "100%"}}>
                <Produs key={product.id} produs={product} />
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
    
    console.log("Searching for products with name containing " + query + " in database");
    var { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('product_name', `%${query}%`)

    const produse = data;

    var { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('brand', `%${query}%`)

    produse.push(data);

    for (let i = 0; i < data.length; i++) {
        const { data } = supabase
            .storage
            .from('products')
            .getPublicUrl(`${produse[i][0].barcode}.${produse[i][0].image_format}`)

        produse[i][0].image = `${data.publicUrl}`
    }

    return {
        props: {
            query: query,
            products: produse[0]
        }
    }
}
import Head from "next/head";
import Image from "next/image";

import styles from "@/styles/routes/produs.module.css";

import Topbar from "@/components/Topbar";
import Card from "@/components/Card";
import Tooltip from "@/components/produs/Tooltip";

import { supabase } from "@/pages/index";
import { useRouter } from "next/router";

export default function Produs({ produs }) {
    const router = useRouter();

    const ingredients = produs.ingredients.split(', ')
    var allergens = ["Nu conține alergeni"]

    if(produs.allergens != null)
        allergens = produs.allergens.split(', ')

    return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div style={{filter: "blur(5px)"}}>
            <Topbar />
            <div className={styles.grid}>
                {Array(8).fill().map((_, i) => (
                    <Card key={i} brand={"product.brand"} name={"product.product_name"} image={"https://upload.wikimedia.org/wikipedia/en/thumb/9/98/Blank_button.svg/146px-Blank_button.svg.png?20100529213045"} calories={"100"} nutriscore={"A"} novascore={1}/>
                ))}
            </div>
        </div>
        <div className={styles.card}>
            <div className={styles.inapoi} onClick={() => router.push('/')}>
                Inapoi
            </div>
            <div className={styles.wrapper}>
                <div style={{width: '200px'}}>
                    <Image src={produs.image} width={200} height={200} className={styles.image} alt={produs.product_name}/>
                </div>
                <div className={styles.titleInfo}>
                    <p className={styles.title}>{produs.brand} - {produs.product_name}</p>
                    <div className={styles.tooltipWrapper}>
                        <Tooltip type="cals" text={produs.kcal + "kcal"} color="#C3E8A6"/>
                        <Tooltip type="nutri" text={"NU: 0"} color="#D0576D"/>
                        <Tooltip type="nova" text={"NO: 0"} color="#F0FEFF"/>
                    </div>
                </div>
            </div>
            <div className={styles.info}>
                <p className={styles.infoTitle}>Ingrediente:</p>
                <div className={styles.container}>
                    {ingredients.map((ingredient) => (
                        <span key={ingredient} className={styles.ingredient}>{ingredient}</span>
                    ))}
                </div>
            </div>

            <div className={styles.info}>
                <p className={styles.infoTitle}>Alergeni:</p>
                <div className={styles.container}>
                    {allergens.map((allergen) => (
                        <span key={allergen} className={styles.ingredient}>{allergen}</span>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
    const { barcode } = context.query;

    if (!barcode) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    var { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)

    if(error)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };

    const produs = data;

    var { data } = supabase
      .storage
      .from('products')
      .getPublicUrl(`${produs[0].barcode}.${produs[0].image_format}`)

    produs[0].image = `${data.publicUrl}`

    return {
        props: {
            produs: produs[0]
        }
    }
}
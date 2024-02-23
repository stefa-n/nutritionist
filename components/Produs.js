import Image from "next/image";

import styles from "@/styles/routes/produs.module.css";

import Tooltip from "@/components/produs/Tooltip";

import { supabase } from "@/pages/index";

export default function Produs({ produs }) {
    const ingredients = produs.ingredients.split(', ')
    var allergens = []

    if(produs.allergens != null)
        allergens = produs.allergens.split(', ')
    else
        allergens[0] = "Nu conține alergeni"

    const inapoi = () => {
        document.getElementsByClassName("product." + produs.id)[0].style.display = "none"
    }

    return (
    <>
        <div className={styles.card}>
            <div className={styles.inapoi} onClick={() => {inapoi()}}>
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
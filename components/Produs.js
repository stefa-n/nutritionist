import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "@/components/styles/Produs.module.css";

import Tooltip from "./produs/Tooltip";

import { supabase } from "@/pages/index";

export default function Produs({ produs }) {
  const [nutriscore, setNutriscore] = useState("");
  const [novascore, setNovascore] = useState("");

  useEffect(() => {
    fetch(
      `https://world.openfoodfacts.org/api/v0/product/${produs.barcode}.json`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.product != null) {
          setNutriscore(data.product.nutriscore_tags[0].toUpperCase());
          setNovascore(data.product.nova_group);
        }
      });
  }, []);

  const ingredients = produs.ingredients.split(", ");
  var allergens = [];

  if (produs.allergens != null) allergens = produs.allergens.split(", ");
  else allergens[0] = "Nu conține alergeni";

  const [storedAllergens, setStoredAllergens] = useState([]);

  useEffect(() => {
    const storedAllergens = localStorage.getItem("allergens");
    if (storedAllergens) {
      setStoredAllergens(JSON.parse(storedAllergens));
    }
  }, []);

  const inapoi = () => {
    document.getElementsByClassName("product." + produs.id)[0].style.display =
      "none";
  };

  return (
    <div>
      <div className={styles.card}>
        <div
          key={produs.id}
          className={styles.inapoi}
          onClick={() => {
            inapoi();
          }}
        >
          Inapoi
        </div>
        <div className={styles.wrapper}>
          <div style={{ width: "200px" }}>
            <Image
              src={produs.image}
              width={200}
              height={200}
              className={styles.image}
              alt={produs.product_name}
            />
          </div>
          <div className={styles.titleInfo}>
            <p className={styles.title}>
              {produs.brand} - {produs.product_name}
            </p>
            <div className={styles.tooltipWrapper}>
              <Tooltip
                type="cals"
                text={produs.kcal + "kcal/100g"}
                color="#C3E8A6"
              />
              <Tooltip
                type="nutri"
                text={"NU: " + nutriscore}
                color="#D0576D"
              />
              <Tooltip type="nova" text={"NO: " + novascore} color="#F0FEFF" />
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>Weight: {produs.weight}g</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>Ingredients:</p>
          <div className={styles.container}>
            {ingredients.map((ingredient) => (
              <span key={ingredient} className={styles.ingredient}>
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.info}>
          <p className={styles.infoTitle}>
            Allergens:{" "}
            <span style={{ fontSize: "12px" }}>
              Allergens set in your profile page are{" "}
              <span
                style={{
                  backgroundColor: "#D0576D",
                  paddingLeft: "5px",
                  paddingRight: "5px",
                  borderRadius: "5px",
                }}
              >
                colored in red
              </span>
            </span>{" "}
          </p>
          <div className={styles.container}>
            {allergens.map((allergen) => (
              <span
                key={allergen}
                className={`${styles.allergen} ${
                  storedAllergens.includes(allergen)
                    ? styles.inLocalStorage
                    : ""
                }`}
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
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
    .from("products")
    .select("*")
    .eq("id", id);

  if (error)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const produs = data;

  var { data } = supabase.storage
    .from("products")
    .getPublicUrl(`${produs[0].id}.${produs[0].image_format}`);

  produs[0].image = `${data.publicUrl}`;

  return {
    props: {
      produs: produs[0],
    },
  };
}

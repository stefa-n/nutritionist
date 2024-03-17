import { useEffect, useState } from "react";

import Image from "next/image";
import styles from "./styles/Card.module.css";
import Tooltip from "./Card/Tooltip";

const nutri_dict = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0,
};

const nova_dict = {
  1: 4,
  2: 3,
  3: 2,
  4: 1,
};

export default function Card({
  barcode,
  brand,
  name,
  image,
  calories,
  onClick,
  subtitle,
  healthScore,
}) {
  const [nutriscore, setNutriscore] = useState(0);
  const [novascore, setNovascore] = useState(0);

  useEffect(() => {
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.product != null) {
          if (data.product.nova_group != null)
            setNovascore(nova_dict[data.product.nova_group]);
          else setNovascore(0);

          if (data.product.nutriscore_tags[0] != null)
            setNutriscore(
              nutri_dict[data.product.nutriscore_tags[0].toUpperCase()]
            );
          else setNutriscore(0);
        }
      });
  }, []);

  return (
    <div className={styles.wrapper} onClick={onClick}>
      <Image
        src={image}
        alt={name}
        width={300}
        height={300}
        className={styles.image}
      />
      <div className={styles.textArea}>
        <p className={styles.title}>
          {brand} - {name}
        </p>
        <p className={styles.subtitle} style={{}}>
          {subtitle}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            position: "absolute",
            bottom: "8px",
            width: "100%",
          }}
        >
          {!subtitle ? (
            <>
              <Tooltip type="cals" text={calories + "kcal"} color="#C3E8A6" />
              <Tooltip
                type="nutri"
                text={"Health score:" + healthScore.toFixed(2)}
                color="#D0576D"
              />
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

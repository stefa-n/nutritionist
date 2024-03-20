import { useEffect, useState } from "react";
import Card2 from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

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
  id,
  remove,
  onRemove,
}) {
  const [nutriscore, setNutriscore] = useState(0);
  const [novascore, setNovascore] = useState(0);

  useEffect(() => {
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      .then((response) => response.json())
      .then((data) => {
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

  const addToBasket = () => {
    let basket = localStorage.getItem("basket");

    if (!basket) {
      basket = [];
    } else {
      basket = JSON.parse(basket);
    }

    if (!basket.includes(id)) {
      basket.push(id);
      localStorage.setItem("basket", JSON.stringify(basket));
    }
  };

  const removeFromBasket = () => {
    let basket = localStorage.getItem("basket");

    if (!basket) {
      return;
    }

    basket = JSON.parse(basket);

    const indexToRemove = basket.indexOf(id);

    if (indexToRemove === -1) {
      return;
    }

    basket.splice(indexToRemove, 1);

    localStorage.setItem("basket", JSON.stringify(basket));
    onRemove();
  };
  return (
    <Card2 className={styles.wrapper}>
      <CardContent onClick={onClick}>
        <CardMedia component="img" image={image} height={300} />
        <div className={styles.textArea}>
          <p className={styles.title}>
            {brand} - {name}
          </p>
          <p className={styles.subtitle} style={{}}>
            {subtitle}
          </p>
          <div style={{ cursor: "default" }}>
            {!subtitle ? (
              <>
                <Tooltip type="cals" text={calories + "kcal"} color="#1fa152" />
                <Tooltip
                  type="nutri"
                  text={
                    "Health score:" + healthScore ? healthScore.toFixed(2) : 0
                  }
                  color="#D0576D"
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </CardContent>
      <CardActions>
        {!remove && (
          <button onClick={addToBasket} className={styles.basketBtn}>
            Add to basket
          </button>
        )}
        {remove && (
          <button onClick={removeFromBasket} className={styles.basketBtn}>
            Remove from basket
          </button>
        )}
      </CardActions>
    </Card2>
  );
}

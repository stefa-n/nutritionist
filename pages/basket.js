import { useEffect, useState } from "react";
import { supabase } from "@/pages/index.js";
import Card from "@/components/Card";
import Produs from "@/components/Produs";
import Topbar from "@/components/Topbar";

import styles from "@/styles/Basket.module.css";

export default function Basket() {
  const [basket, setBasket] = useState([]);
  const [products, setProducts] = useState([]);
  const [nutritionalInfo, setNutritionalInfo] = useState({});
  const fetchBasketFromLocalStorage = async () => {
    const basketString = localStorage.getItem("basket");
    if (basketString) {
      const basketArray = JSON.parse(basketString);
      setBasket(basketArray);
    }
  };

  const fetchProductsByIds = async () => {
    try {
      const { data: produse, error } = await supabase
        .from("products")
        .select("*")
        .in("id", basket);

      if (error) {
        throw error;
      }

      for (let i = 0; i < produse.length; i++) {
        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(`${produse[i].id}.${produse[i].image_format}`);

        produse[i].image = `${data.publicUrl}`;
      }

      setProducts(produse);
      let auxNutritionalInfo = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrates: 0,
        allergens: [],
        healthScore: 0,
      };
      produse.forEach((produs) => {
        console.log(produs);
        auxNutritionalInfo.calories += produs.kcal;
        auxNutritionalInfo.allergens = auxNutritionalInfo.allergens.concat(
          produs.allergens.split(",").map((item) => item.trim())
        );
        auxNutritionalInfo.healthScore += produs.health_score / produse.length;
      });
      if (produse) {
        auxNutritionalInfo.allergens = [
          ...new Set(auxNutritionalInfo.allergens),
        ];
      }
      setNutritionalInfo(auxNutritionalInfo);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    }
  };

  useEffect(() => {
    fetchBasketFromLocalStorage();
  }, []);

  useEffect(() => {
    if (basket.length > 0) {
      fetchProductsByIds();
    }
  }, [basket]);
  return (
    <>
      <Topbar search={false} />
      <div className={styles.container}>
        <div className={styles.column} style={{ flex: "0 0 70%" }}>
          <h1>Your basket</h1>
          <div className={styles.grid}>
            {products &&
              products.map((product) => (
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
                    remove={true}
                    onRemove={fetchBasketFromLocalStorage}
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
                    <Produs produs={product} onVote={fetchProductsByIds} />
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.column} style={{ flex: "0 0 30%" }}>
          {nutritionalInfo && "allergens" in nutritionalInfo && (
            <div style={styles.nutritionalInfo}>
              <h2>Basket Nutritional Information</h2>
              <ul>
                <li>Calories: {nutritionalInfo.calories}</li>
                <li>Protein: {nutritionalInfo.protein}</li>
                <li>Fat: {nutritionalInfo.fat}</li>
                <li>Carbohydrates: {nutritionalInfo.carbohydrates}</li>
              </ul>
              <h2>Allergens/Dietary Preferences</h2>
              <ul>
                {nutritionalInfo.allergens.map((allergen, index) => (
                  <li key={index}>{allergen}</li>
                ))}
              </ul>
              <h2>Health Score</h2>
              <p>Score: {nutritionalInfo.healthScore}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

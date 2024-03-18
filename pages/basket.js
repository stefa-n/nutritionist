import { useEffect, useState } from "react";
import { supabase } from "@/pages/index.js";
import Card from "@/components/Card";
import Produs from "@/components/Produs";

import styles from "@/styles/Basket.module.css";

export default function Basket() {
  const [basket, setBasket] = useState([]);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchBasketFromLocalStorage = async () => {
      const basketString = localStorage.getItem("basket");
      if (basketString) {
        const basketArray = JSON.parse(basketString);
        setBasket(basketArray);
      }
    };

    fetchBasketFromLocalStorage();
  }, []);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    if (basket.length > 0) {
      fetchProductsByIds();
    }
  }, [basket]);
  return (
    <>
      <div>basket</div>
      <div className={`${styles.grid}`}>
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
                <Produs produs={product} />
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

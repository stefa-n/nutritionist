import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/admin/Recruit.module.css";

import { useRouter } from "next/router";
import { admin_supabase } from "../api/admin/supabase";

export default function Review() {
  const [product, setProduct] = useState([]);
  const [off, setOff] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    if (!id) {
      router.push("/admin");
    }

    const fetchProduct = async () => {
      const accessToken = localStorage.getItem("access_token");
      let response = await fetch(`/api/admin/getsubmission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, id }),
      });
      if (!response.ok) {
        router.push("/admin");
      } else {
        const data = await response.json();
        setProduct(data);
      }
    };
    fetchProduct();
  }, []);

  useEffect(() => {
    const { id } = router.query;
    if (!id) {
      router.push("/admin");
    }

    const fetchOpenFoodFacts = async () => {
      let { data: productData, error } = await admin_supabase
        .from("products")
        .select("*")
        .eq("id", id);

      let response = await fetch(
        "https://world.openfoodfacts.org/api/v0/product/" +
          productData[0].barcode +
          ".json"
      );
      if (response.ok) {
        const data = await response.json();
        setOff({
          brand: data.product.brands,
          product_name: data.product.product_name,
          ingredients: data.product.ingredients_text_en,
          kcal: data.product.nutriments["energy-kcal_100g"],
          weight: parseInt(data.product.quantity_imported, 10),
          allergens: data.product.allergens_tags.map((allergen) =>
            allergen.replace("en:", ", ")
          ),
        });
      }
    };
    fetchOpenFoodFacts();
  }, []);

  const handleApprove = async () => {
    const accessToken = localStorage.getItem("access_token");
    await fetch(`/api/admin/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, id: product.id }),
    });
    router.push("/admin");
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("access_token");
    await fetch(`/api/admin/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, id: product.id }),
    });
    router.push("/admin");
  };

  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main}`}>
        <div
          style={{
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Image
            src={product.image}
            alt={product.product_name}
            width={200}
            height={200}
            style={{
              borderRadius: "10px",
              width: "auto",
              height: "100%",
              maxHeight: "calc(326.03px - 113.11px)",
            }}
          />
          <div style={{ maxWidth: "50%" }}>
            <div>Submitted by: {product.owned_by_uid}</div>
            <div>Submitted at: {product.created_at}</div>
            <div>Barcode: {product.barcode}</div>
            <div>Brand: {product.brand}</div>
            <div>Product Name: {product.product_name}</div>
            <div>Ingredients: {product.ingredients}</div>
            <div>Allergens: {product.allergens}</div>
            <div>Calories: {product.kcal}kcal/100g</div>
          </div>
        </div>
        <div style={{ maxWidth: "50%", marginBottom: "1rem" }}>
          <div>OpenFoodFacts Data:</div>
          <div>Brand: {off.brand}</div>
          <div>Product Name: {off.product_name}</div>
          <div>Ingredients: {off.ingredients}</div>
          <div>Allergens: {off.allergens}</div>
          <div>Calories: {off.kcal}kcal/100g</div>
          <div>Weight: {off.weight}g</div>
        </div>
        <div style={{ display: "flex" }}>
          <div className={styles.approved} onClick={() => handleApprove()}>
            Approve
          </div>
          <div className={styles.delete} onClick={() => handleDelete()}>
            Delete
          </div>
          <Link
            href={"https://world.openfoodfacts.org/product/" + product.barcode}
            className={styles.off}
            target="_blank"
          >
            OpenFoodFacts
          </Link>
        </div>
      </main>
    </>
  );
}

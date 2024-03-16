import { useEffect, useState } from "react";
import Head from "next/head";

import styles from "@/styles/admin/Home.module.css";

import Card from "@/components/Card";
import Produs from "@/components/Produs";

import { useRouter } from "next/router";
import Topbar from "@/components/Topbar";

export default function Home() {
  const [submissions, setSubmissions] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchSubmissions = async () => {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`/api/admin/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      if (!response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setSubmissions(data);
      }
    };
    fetchSubmissions();
  }, []);

  return (
    <>
      <Head>
        <title>Nutritionist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Topbar />
      <main className={`${styles.main}`}>
        <div className={`${styles.grid}`}>
          {submissions.map((product) => (
            <div key={product.id}>
              <Card
                barcode={product.barcode}
                key={product.id}
                brand={product.brand}
                name={product.product_name}
                image={product.image}
                calories={product.kcal}
                onClick={() => {
                  router.push("/admin/review?id=" + product.id);
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
      </main>
    </>
  );
}

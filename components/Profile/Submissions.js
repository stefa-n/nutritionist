import { useState, useEffect } from "react";
import Router from "next/router";
import Card from "../Card";
import styles from "../styles/Submissions.module.css";
import EditSubmission from "./EditSubmission";

import { createClient } from "@supabase/supabase-js";

const Submissions = () => {
  const [supabase, setSupabase] = useState();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        return;
      }
      setSupabase(createClient(
        "https://devjuheafwjammjnxthd.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
        {
          'global': {
            'headers': {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        }
      ));
      const response = await fetch(`/api/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      if (!response.ok) {
        Router.push("/login");
        return;
      }
      const data = await response.json();
      setSubmissions(data);
    };
    fetchSubmissions();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        maxWidth: "1000px",
      }}
    >
      <p style={{ width: "100%", float: "left" }}>My Submissions</p>
      <div className={styles.submissions}>
        {submissions.map((product) => (
          <div key={product.id}>
            <Card
              barcode={product.barcode}
              key={product.id}
              brand={product.brand}
              name={product.product_name}
              image={product.image}
              calories={product.kcal}
              subtitle={!product.approved ? "Pending Approval" : null}
              healthScore={product.health_score}
              onClick={
                !product.approved
                  ? () => {
                      document.getElementById(
                        "submission." + product.id
                      ).style.display = "";
                    }
                  : null
              }
            />
            {!product.approved ? (
              <EditSubmission product={product} supabase={supabase} />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submissions;

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@supabase/supabase-js";
import styles from "../styles/Badges.module.css";

export default function Badges() {
  const [total_points, setTotalPoints] = useState(0);

  const fetchTotalPoints = async () => {
    let accessToken = localStorage.getItem("access_token");
    let user = jwtDecode(accessToken);

    const supabase = createClient(
      "https://devjuheafwjammjnxthd.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldmp1aGVhZndqYW1tam54dGhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyODE4OTIsImV4cCI6MjAyMzg1Nzg5Mn0.nb5Hx-GEORyNSyoBcVfFC3ktfS5x7vCqBtsD3kJR25M",
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    let { data, error } = await supabase
      .from("user_data")
      .select("*")
      .eq("user_id", user.sub);

    if (error) {
      console.error(error);
      return;
    }

    if (!data[0]) setTotalPoints(0);
    else setTotalPoints(data[0].total_points);
  };

  useEffect(() => {
    fetchTotalPoints();
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
      <p style={{ float: "left", width: "100%" }}>My Badges</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: "400px",
          justifyContent: "center",
        }}
      >
        {total_points > 100 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/bronze.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Bronze: 100 points</span>
          </div>
        )}
        {total_points > 200 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/silver.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Silver: 200 points</span>
          </div>
        )}
        {total_points > 300 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/gold.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Gold: 300 points</span>
          </div>
        )}
        {total_points > 400 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/platinum.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Platinum: 400 points</span>
          </div>
        )}
        {total_points > 500 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/diamond.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Diamond: 500 points</span>
          </div>
        )}
        {total_points > 700 && (
          <div className={`${styles.badge}`}>
            <img
              src="/images/badges/legendary.webp"
              style={{ width: "100px", height: "100px" }}
            />
            <span>Legendary: 700 points</span>
          </div>
        )}
      </div>
    </div>
  );
}

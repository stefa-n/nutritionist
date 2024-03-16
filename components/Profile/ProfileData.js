import { useState, useEffect } from "react";
import styles from "../styles/ProfileData.module.css";
import { useRouter } from "next/router";

const ProfileData = () => {
  const router = useRouter();
  let accessToken = "";

  const updateEmail = async (e) => {
    accessToken = localStorage.getItem("access_token");

    if (
      document.getElementById("email").value !==
      document.getElementById("confirm-email").value
    )
      return;

    const response = await fetch("/api/update-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        accessToken,
      }),
    });
    if (response.ok) {
      localStorage.removeItem("access_token");
      router.push("login");
    }
  };

  const updatePass = async (e) => {
    accessToken = localStorage.getItem("access_token");

    if (
      document.getElementById("password").value !==
      document.getElementById("confirm-password").value
    )
      return;

    const response = await fetch("/api/update-pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: document.getElementById("password").value,
        accessToken,
      }),
    });
    if (response.ok) {
      localStorage.removeItem("access_token");
      router.push("login");
    }
  };

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
      <p style={{ width: "100%", float: "left" }}>Edit Profile Information</p>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            name="email"
            type="text"
            placeholder="E-mail"
            style={{ width: "100%" }}
            className={styles.input}
            id="email"
          />
          <input
            name="email"
            type="text"
            placeholder="Confirm E-mail"
            style={{ width: "100%" }}
            className={styles.input}
            id="confirm-email"
          />
        </div>
        <div className={styles.submit} onClick={updateEmail}>
          Confirm
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "1rem", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            name="email"
            type="password"
            placeholder="Password"
            style={{ width: "100%" }}
            className={styles.input}
            id="password"
          />
          <input
            name="email"
            type="password"
            placeholder="Confirm Password"
            style={{ width: "100%" }}
            className={styles.input}
            id="confirm-password"
          />
        </div>
        <div className={styles.submit} onClick={updatePass}>
          Confirm
        </div>
      </div>
    </div>
  );
};

export default ProfileData;

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import styles from "@/styles/Login.module.css";

export default function Login() {
  const [subtitle, setSubtitle] = useState("Creează un cont");
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("access_token") === null) return;

    const user = jwtDecode(localStorage.getItem("access_token"));
    if (user.aud) {
      router.push("/");
    }
  });

  async function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email === "" || password === "") return;
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(email) === false) return setSubtitle("Email invalid.");

    const response = await fetch(`/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/login");
    }
  }
  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Bine ai venit la Nutritionist!</p>
        <p className={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleSignup} className={styles.form}>
          <p style={{ margin: 0 }}>Email</p>
          <input name="email" placeholder="Introdu adresa ta de email" />
          <br />
          <p style={{ margin: 0 }}>Parolă</p>
          <input
            type="password"
            name="password"
            placeholder="Introdu o parolă pentru contul tău"
          />
          <button type="submit">Continuă</button>
        </form>

        <p className={styles.subtitle} style={{ marginBottom: 0 }}>
          Ai deja un cont?{" "}
          <Link href="/login" style={{ color: "blue", textDecoration: "none" }}>
            Loghează-te
          </Link>
        </p>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import styles from "@/styles/Login.module.css";
import { resolve } from "styled-jsx/css";

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    if(localStorage.getItem("access_token") === null) return;
    
    const user = jwtDecode(localStorage.getItem("access_token"));
    if (user.aud) {
      router.push("/");
    }
  });

  async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if(email === "" || password === "") return;
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if(regex.test(email) === false) return setSubtitle("Email invalid.");

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const resolvedPromise = await response.json();
      if(resolvedPromise.data.user == null) return setSubtitle("Email sau parolă greșită");
      if(resolvedPromise.data.session == null) return;
      localStorage.setItem(
        "access_token",
        resolvedPromise.data.session.access_token
      );
      router.push("/profile");
    }
  }

  const [subtitle, setSubtitle] = useState("Loghează-te pentru a accesa profilul");

  return (
    <>
      <div className={styles.container}>
        <p className={styles.title}>Bine ai venit la Nutritionist!</p>
        <p className={styles.subtitle}>{subtitle}</p>

        <form onSubmit={handleLogin} className={styles.form}>
          <p style={{margin: 0}}>Email</p>
          <input name="email" placeholder="Introdu adresa ta de email" />
          <br />
          <p style={{margin: 0}}>Parolă</p>
          <input type="password" name="password" placeholder="Introdu parola asociată contului tău" />
          <button type="submit">Continuă</button>
        </form>

        <p className={styles.subtitle} style={{marginBottom: 0}}>Nu ai cont? <Link href="/signup" style={{color: 'blue', textDecoration: 'none'}}>Creează</Link></p>
        <p className={styles.subtitle}>Ai uitat parola? <Link href="/reset" style={{color: 'blue', textDecoration: 'none'}}>Resetează</Link></p>
      </div>
    </>
  );
}
